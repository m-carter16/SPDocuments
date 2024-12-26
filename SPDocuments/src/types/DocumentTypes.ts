export type SpUser = {
    Id: number;
    Title: string;
    EMail: string;
}

export type SpFile = {
    Name: string;
    ServerRelativeUrl: string;
}

export type SPDocument = {
    Id?: number;
    File: SpFile;
    File_x0020_Type?: string;
    DocumentType: string;
    RecordId: string;
    Modified?: string;
    Editor?: SpUser;
    Created?: string;
    Author?: SpUser;
};

export type DocumentItem = {
    id?: number;
    documentType: string;
    group: string;
    recordId: string;
    file?: File;
    filePath: string;
    fileType: string;
    modifiedBy?: { label: string }
    lastUpdated?: string;
}

export type PaServiceData = {
    action: string;
    data: {
        id: number | null;
        documentType: string;
        group: string;
        recordId: string;
        file: File | null;
        filePath: string;
        fileType: string;
        siteUrl: string;
        libraryName: string;
    }
}