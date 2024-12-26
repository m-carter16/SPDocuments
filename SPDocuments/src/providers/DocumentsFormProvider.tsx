import * as React from 'react';
import { DocumentItem } from '../types/DocumentTypes';
import { useApiProvider } from './ApiProvider';
import { useDocumentsProvider } from './DocumentsProvider';
import { IFolderInfo } from '@pnp/sp/folders';

type ItemFolders = {
    groupFolder: IFolderInfo;
    recordFolder: IFolderInfo;
};

type DocumentsFormModel = {
    formItems: DocumentItem[];
    isPanelOpen: boolean;
    isDeleting: boolean;
    setFormItems: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
    setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    ensureFolders: (item: DocumentItem) => Promise<ItemFolders>;
    createDocument: (item: DocumentItem, recordFolder: IFolderInfo) => void;
    updateDocument: (item: DocumentItem) => void;
    deleteDocument: (item: DocumentItem) => void;
};

type DocumentsFormProviderProps = {
    children: React.ReactNode;
};

const DocumentsFormContext = React.createContext({} as DocumentsFormModel);

const DocumentsFormProvider: React.FC<DocumentsFormProviderProps> = (props) => {
    const { children } = props;
    const { items, setItems, getDocuments, setIsSelected } = useDocumentsProvider();
    const { spService, dataverseService } = useApiProvider();
    const [formItems, setFormItems] = React.useState<DocumentItem[]>([]);
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

    const updateGroup = async (item: DocumentItem): Promise<DocumentItem> => {
        const record = await dataverseService.getRecord();
        item.group = record['_owningbusinessunit_value@OData.Community.Display.V1.FormattedValue'];
        return item;
    };

    const createDocument = async (item: DocumentItem, recordFolder: IFolderInfo) => {
        const newItem = await updateGroup(item);
        const result = await spService.createDocument(newItem, recordFolder);
        if (result.status === 200) {
            getDocuments();
            return result;
        }
        // TODO: handle error
    };

    const updateDocument = async (item: DocumentItem) => {
        const result = await spService.updateDocument(item);
        if (result.status === 200) {
            setIsSelected(false);
            getDocuments();
            return result;
        }
        // TODO: handle error     
    };

    const ensureFolders = async (item: DocumentItem): Promise<ItemFolders> => {
        const newItem = await updateGroup(item);
        const groupFolder = await spService.ensureGroupFolder(newItem);
        const recordFolder = await spService.ensureRecordFolder(newItem);
        return { groupFolder, recordFolder };
    };

    const deleteDocument = async (item: DocumentItem) => {
        try {
            if (item.id) {
                setIsDeleting(true);
                const result = await spService.deleteDocument(item.id);
                if (result.status === 200) {
                    // refresh documents and existing files list
                    const newFiles = items.filter(i => i.file?.name !== item.file?.name);
                    setItems(newFiles);
                    getDocuments();

                    // refresh and close form
                    const newFormFiles = formItems.filter(i => i.file?.name !== item.file?.name);
                    setFormItems(newFormFiles);
                    // close form if no items remaining
                    if (newFormFiles.length === 0) {
                        setIsPanelOpen(false);
                        setIsSelected(false);
                    }
                    setIsDeleting(false);
                }
            } else {
                const newFormFiles = formItems.filter(i => i.file?.name !== item.file?.name);
                setFormItems(newFormFiles);
                // close form if no items remaining
                if (newFormFiles.length === 0) {
                    setIsPanelOpen(false);
                    setIsSelected(false);
                    setIsDeleting(false);
                }
            }

        } catch (error) {
            console.log("Error deleting document: ", error);
            setIsDeleting(false);
        }
    };

    return (
        <DocumentsFormContext.Provider
            value={{
                formItems,
                isPanelOpen,
                isDeleting,
                setFormItems,
                setIsPanelOpen,
                ensureFolders,
                createDocument,
                updateDocument,
                deleteDocument,
            }}
        >
            {children}
        </DocumentsFormContext.Provider>
    );
};

const useDocumentsFormProvider = (): DocumentsFormModel => React.useContext(DocumentsFormContext);

export { DocumentsFormProvider, useDocumentsFormProvider };
