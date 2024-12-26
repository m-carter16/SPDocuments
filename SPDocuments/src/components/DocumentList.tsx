import * as React from 'react';
// import { items } from '../MockProps';
import {
    Avatar, createTableColumn, DataGrid, DataGridBody,
    DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridProps,
    DataGridRow, Link, Spinner, TableCellLayout, TableColumnDefinition,
    TableRowId,
} from '@fluentui/react-components';
import DocumentIcon from './DocumentIcon';
import { Document16Regular } from "@fluentui/react-icons";
import { useFilterProvider } from '../providers/FilterProvider';
import { DocumentItem } from '../types/DocumentTypes';
import { useDocumentsProvider } from '../providers/DocumentsProvider';
import { useDocumentsFormProvider } from '../providers/DocumentsFormProvider';

const columns: TableColumnDefinition<DocumentItem>[] = [
    createTableColumn<DocumentItem>({
        columnId: "fileType",
        renderHeaderCell: () => {
            return <Document16Regular />;
        },
        renderCell: (item) => {
            return (
                <TableCellLayout media={<DocumentIcon fileType={item.file ? item.fileType : "genericfile"} />}>
                </TableCellLayout>
            );
        },
    }),
    createTableColumn<DocumentItem>({
        columnId: "file",
        compare: (a, b) => {
            if (a.file && b.file) {
                return a.file.name.localeCompare(b.file.name);
            } else {
                return 1;
            }
            
        },
        renderHeaderCell: () => {
            return <span style={{ fontWeight: 600 }}>Name</span>;
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    <Link href={item.filePath} target="_blank">{item.file?.name}</Link>
                </TableCellLayout>
            );
        },
    }),
    createTableColumn<DocumentItem>({
        columnId: "docType",
        compare: (a, b) => {
            return a.documentType.localeCompare(b.documentType);
        },
        renderHeaderCell: () => {
            return <span style={{ fontWeight: 600 }}>Document Type</span>;
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    {item.documentType}
                </TableCellLayout>
            );
        },
    }),
    createTableColumn<DocumentItem>({
        columnId: "group",
        compare: (a, b) => {
            return a.group.localeCompare(b.group);
        },
        renderHeaderCell: () => {
            return <span style={{ fontWeight: 600 }}>Owning Business Unit</span>;
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    {item.group}
                </TableCellLayout>
            );
        },
    }),
    createTableColumn<DocumentItem>({
        columnId: "modifiedBy",
        compare: (a, b) => {
            if (a.modifiedBy && b.modifiedBy) {
                return a.modifiedBy.label.localeCompare(b.modifiedBy.label);
            } else {
                return 1;
            }            
        },
        renderHeaderCell: () => {
            return <span style={{ fontWeight: 600 }}>Modified By</span>;
        },
        renderCell: (item) => {
            return (
                <TableCellLayout
                // media={
                //     <Avatar
                //         aria-label={item.modifiedBy.label}
                //         name={item.modifiedBy.label}
                //         // badge={{ status: item.modifiedBy.status }}
                //     />
                // }
                >
                    {item.modifiedBy?.label}
                </TableCellLayout>
            );
        },
    }),
    createTableColumn<DocumentItem>({
        columnId: "modifiedOn",
        compare: (a, b) => {
            if (a.lastUpdated && b.lastUpdated) {
                const date1 = new Date(a.lastUpdated).getTime();
                const date2 = new Date(b.lastUpdated).getTime();
                return date1 - date2;
            } else {
                return 1;
            }
        },
        renderHeaderCell: () => {
            return <span style={{ fontWeight: 600 }}>Modified</span>;
        },

        renderCell: (item) => {
            return item.lastUpdated;
        },
    }),
];

const columnSizingOptions = {
    fileType: {
        defaultWidth: 42,
        minWidth: 40,
        idealWidth: 42,
    },
    group: {
        defaultWidth: 175,
        minWidth: 150,
        idealWidth: 175,
    },
    file: {
        defaultWidth: 300,
        minWidth: 250,
        idealWidth: 300,
    },
    docType: {
        defaultWidth: 275,
        minWidth: 250,
        idealWidth: 275,
    }
};

const DocumentList: React.FC = () => {
    const { items, setIsSelected } = useDocumentsProvider();
    const { setFormItems } = useDocumentsFormProvider();
    const { filterDocuments } = useFilterProvider();
    const [selectedRows, setSelectedRows] = React.useState(new Set<TableRowId>([]));
    const filteredItems = filterDocuments(items);

    const onSelectionChange: DataGridProps["onSelectionChange"] = (e, data) => {
        const selectedIndicies = Array.from(data.selectedItems);
        const selectedData = selectedIndicies.map(index => items[index as number]);
        data.selectedItems.size > 0 ? setIsSelected(true) : setIsSelected(false);
        setSelectedRows(data.selectedItems);
        setFormItems(selectedData);
    };

    if (items.length > 0 && filteredItems.length === 0) {
        return (
            <div style={{
                flex: 1,
                fontSize: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
            }}>
                <p>No documents found for your search query.</p>
            </div>
        );
    }
    
    return (
        <DataGrid
            items={filteredItems}
            columns={columns}
            sortable
            selectionMode="multiselect"
            selectedItems={selectedRows}
            onSelectionChange={onSelectionChange}
            getRowId={(item) => item.key}
            columnSizingOptions={columnSizingOptions}
            resizableColumns
            focusMode="composite"
            style={{ minWidth: "550px" }}
        >
            <DataGridHeader>
                <DataGridRow
                    selectionCell={{
                        checkboxIndicator: { "aria-label": "Select all rows" },
                    }}
                >
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                </DataGridRow>
            </DataGridHeader>
            <DataGridBody<DocumentItem>>
                {({ item, rowId }) => (
                    <DataGridRow<DocumentItem>
                        key={rowId}
                        selectionCell={{
                            checkboxIndicator: { "aria-label": "Select row" },
                        }}
                    >
                        {({ renderCell }) => (
                            <DataGridCell>{renderCell(item)}</DataGridCell>
                        )}
                    </DataGridRow>
                )}
            </DataGridBody>
        </DataGrid>
    );
}

export default DocumentList;