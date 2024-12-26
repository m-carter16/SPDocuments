import * as React from 'react';
import { DocumentItem } from '../types/DocumentTypes';
import { useApiProvider } from './ApiProvider';
import { SpService } from '../api/SpService';
import { GROUPS } from '../shared/MockProps';

type DocumentsModel = {
        recordId: string;
        documentTypes: string[];
        groups: string[];
        items: DocumentItem[];
        isSelected: boolean;
        isLoading: boolean;
        setItems: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
        setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
        getDocuments: () => void;
};

type DocumentsProviderProps = {    
    recordId: string;
    documentTypes: string[];
    children: React.ReactNode;
};

const DocumentsContext = React.createContext({} as DocumentsModel);

const DocumentsProvider: React.FC<DocumentsProviderProps> = (props) => {
    const { recordId, documentTypes, children } = props;
    const { spService } = useApiProvider();
    const [items, setItems] = React.useState<DocumentItem[]>([]);
    const [isSelected, setIsSelected] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const groups = GROUPS;

    const getDocuments = async () => {
        try {
            setIsLoading(true);
            const results = await spService.getDocuments(recordId);
            setItems(results);
            setIsLoading(false);
        } catch (error) {
            console.log("Error fetching documents: ", error);
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        getDocuments();
    }, [SpService]);

    return (
        <DocumentsContext.Provider
            value={{
                recordId,
                documentTypes,
                groups,
                items,
                isSelected,
                isLoading,
                setItems,
                setIsSelected,
                getDocuments,
            }}
        >
            {children}
        </DocumentsContext.Provider>
    );
};

const useDocumentsProvider = (): DocumentsModel => React.useContext(DocumentsContext);

export { DocumentsProvider, useDocumentsProvider };
