import * as dayjs from 'dayjs';
import { getBaseUrl, getSP } from "./pnpjsPresets";
import { SPFI } from "@pnp/sp";
import { DocumentItem, SPDocument, SpFile } from '../types/DocumentTypes';
import { IFolderInfo } from '@pnp/sp/folders';

export class SpService {
    private _sp: SPFI;
    private _baseUrl: string;
    private _siteUrl: string;
    private _sitePath: string;
    private _libraryName: string;
    private _recordId: string;

    constructor(siteUrl: string, libraryName: string, clientId: string, recordId: string) {
        this._sp = getSP(siteUrl, clientId);
        this._baseUrl = getBaseUrl(siteUrl);
        this._siteUrl = siteUrl;
        this._libraryName = libraryName;
        this._recordId = recordId;

        const pathSegments = this._siteUrl.split("/");
        this._sitePath = `${pathSegments[3]}/${pathSegments[4]}`;
    }

    /**
     * Ensures that folder exists in SharePoint and creates it if needed
     * @param item 
     * @returns 
     */
    private async ensureFolder(folderPath: string): Promise<IFolderInfo> {
        const folder = await this._sp.web.getFolderByServerRelativePath(folderPath).select('Exists,ServerRelativeUrl')();
        if (!folder.Exists) {
            const newFolder = await this._sp.web.folders.addUsingPath(folderPath);
            return newFolder;
        } else {
            return folder;
        }
    }

    private async getFolder(folderPath: string) {
        const folder = await this._sp.web.getFolderByServerRelativePath(folderPath)()
        return folder;
    }

    /**
     * Converts SharePoint file to javascript file to be used in app 
     * @param file 
     * @returns 
     */
    private convertSpFile = async (file: SpFile): Promise<File> => {
        const blob: Blob = await this._sp.web.getFileByServerRelativePath(`${file.ServerRelativeUrl}`).getBlob();
        const convertedFile = new File([blob], file.Name, { type: blob.type });
        return convertedFile;
    }

    /**
     * Formats results from getDocuments to be used in the app
     * @param results 
     * @returns 
     */
    private formatResults = async (results: SPDocument[]): Promise<DocumentItem[]> => {
        const items: DocumentItem[] = [];
        const promises = results.map(async (item, index) => {
            const path = this._baseUrl + item.File.ServerRelativeUrl;
            const file = await this.convertSpFile(item.File);
            const pathSegments = item.File.ServerRelativeUrl.split("/");
            items.push({
                id: item.Id ? item.Id : index,
                documentType: item.DocumentType,
                group: pathSegments[4],
                recordId: this._recordId,
                file: file,
                filePath: path,
                fileType: item.File_x0020_Type ? item.File_x0020_Type : "genericfile",
                modifiedBy: {
                    label: item.Editor ? item.Editor.Title : "",
                },
                lastUpdated: item.Modified ? dayjs(item.Modified).format('D MMMM YYYY') : ""
            });
        });

        await Promise.all(promises);
        return items;
    }

    /**
     * Get any documents linked to the record passed in via the recordId
     * @param recordId 
     * @returns 
     */
    public getDocuments = async (recordId: string): Promise<DocumentItem[]> => {
        const _select = [
            'Id',
            'RecordId',
            'DocumentType',
            'Created',
            'File/Name',
            'File/ServerRelativeUrl',
            'File/LinkingUrl',
            'Author/Id',
            'Author/Title',
            'Author/EMail',
            'Modified',
            'Editor/Id',
            'Editor/Title',
            'Editor/EMail',
            'File_x0020_Type'
        ].join(',');

        try {
            const results = await this._sp.web.lists.getByTitle(this._libraryName).items
                .select(_select)
                .expand("Author, Editor, File")
                .filter(`RecordId eq '${recordId}'`)
                .top(100)();

            const formattedResults = await this.formatResults(results);
            console.log("🚀 ~ SpService ~ getDocuments= ~ formattedResults:", formattedResults);
            return formattedResults;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    /**
     * Ensures that the folder for the group exists if not, it creates the folder.
     * @param item 
     * @returns 
     */
    public ensureGroupFolder = async (item: DocumentItem): Promise<IFolderInfo> => {
        const groupPath = `/${this._sitePath}/${this._libraryName}/${item.group}`;
        const groupFolder = await this.ensureFolder(groupPath);
        return groupFolder;
    }

    /**
     * Ensures that the folder for the record exists if not, it creates the folder. The name of folder will be the record GUID.
     * @param item
     * @returns 
     */
    public ensureRecordFolder = async (item: DocumentItem): Promise<IFolderInfo> => {
        const recordPath = `/${this._sitePath}/${this._libraryName}/${item.group}/${this._recordId}`;
        const recordFolder = await this.ensureFolder(recordPath);
        return recordFolder;
    }

    /**
     * Creates document in SharePoint library
     * @param item 
     * @returns 
     */
    public createDocument = async (item: DocumentItem, recordFolder: IFolderInfo): Promise<{ status: number }> => {
        try {
            if (item.file) {
                const fileNamePath = encodeURI(item.file.name);
                const content = item.file;

                if (recordFolder) {
                    const file = await this._sp.web.getFolderByServerRelativePath(recordFolder.ServerRelativeUrl)
                        .files.addUsingPath(fileNamePath, content, { Overwrite: true });

                    const fileItem = await this._sp.web.getFileByServerRelativePath(file.ServerRelativeUrl).getItem();

                    await fileItem.update({
                        DocumentType: item.documentType,
                        RecordId: item.recordId,
                        PMWFIO: item.group,
                    });
                }
                return { status: 200 };
            } else {
                return { status: 400 }
            }

        } catch (error) {
            console.log(error);
            return { status: 500 };
        }
    };

    /**
     * Updates document in SharePoint library
     * @param item 
     * @returns 
     */
    public updateDocument = async (item: DocumentItem): Promise<{ status: number }> => {
        try {
            if (item.id) {
                await this._sp.web.lists.getByTitle(this._libraryName).items.getById(item.id).update({
                    DocumentType: item.documentType,
                });
                return { status: 200 };
            } else {
                return { status: 400 }
            }

        } catch (error) {
            console.log(error);
            return { status: 500 };
        }
    };

    /**
     * Deletes document in SharePoint library
     * @param item 
     * @returns 
     */
    public deleteDocument = async (id: number): Promise<{ status: number }> => {
        try {
            await this._sp.web.lists.getByTitle(this._libraryName).items.getById(id).delete();
            return { status: 200 };
        } catch (error) {
            console.log(error);
            return { status: 500 };
        }
    };
}
