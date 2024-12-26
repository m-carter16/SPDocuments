import * as React from 'react';
import { DocumentItem } from '../types/DocumentTypes';

type FilterModel = {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    filterDocuments: (items: DocumentItem[]) => DocumentItem[];
};

const FilterContext = React.createContext({} as FilterModel);

const FilterProvider = (props: { children: React.ReactNode }) => {
    const { children } = props;
    const [searchValue, setSearchValue] = React.useState<string>("");

    const filterBySearch = (item: DocumentItem): DocumentItem | undefined => {
        const fileName: string = item.file?.name ? item.file.name.toLowerCase() : "";
        const fileType: string = item.documentType ? item.documentType.toLowerCase() : "";
        const group: string = item.group? item.group.toLowerCase() : "";
        const fileEditor: string = item.modifiedBy?.label ? item.modifiedBy.label.toLowerCase() : "";
        const fileModified: string = item.lastUpdated ? item.lastUpdated.toLowerCase() : "";
        if (fileName.indexOf(searchValue.toLowerCase()) !== -1
            || fileType.indexOf(searchValue.toLowerCase()) !== -1
            || group.indexOf(searchValue.toLowerCase()) !== -1
            || fileEditor.indexOf(searchValue.toLowerCase()) !== -1
            || fileModified.indexOf(searchValue.toLowerCase()) !== -1) {
            return item;
        }
    };

    const filterDocuments = (items: DocumentItem[]): DocumentItem[] => {
        let filteredItems = items;
        if (searchValue) {
            filteredItems = filteredItems.filter((item) => filterBySearch(item));
        }
        return filteredItems;
    };

    return (
        <FilterContext.Provider
            value={{
                searchValue,
                setSearchValue,
                filterDocuments,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

const useFilterProvider = (): FilterModel => React.useContext(FilterContext);

export { FilterProvider, useFilterProvider };
