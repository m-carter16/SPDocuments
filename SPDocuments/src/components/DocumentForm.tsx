import * as React from 'react';
import { makeStyles, Button, TableCellLayout, createTableColumn, TableColumnDefinition, DataGrid, DataGridHeader, DataGridHeaderCell, DataGridRow, DataGridBody, DataGridCell, DataGridCellFocusMode, TableColumnId, Spinner } from '@fluentui/react-components';
import { DeleteRegular } from '@fluentui/react-icons';
import { bytesToSize } from '../shared/BytesConversion';
import { DocumentItem } from '../types/DocumentTypes';
import { useDocumentsFormProvider } from '../providers/DocumentsFormProvider';
import CustomDropdown from '../shared/CustomDropdown';
import { useDocumentsProvider } from '../providers/DocumentsProvider';

const useStyles = makeStyles({
    form: {
        margin: "14px",
    },
    field: {
        // Stack the label above the field
        display: "flex",
        flexDirection: "column",
        // Use 2px gap below the label (per the design system)
        gap: "2px",
        paddingBottom: "15px"
    },
});

const DocumentForm: React.FC = () => {
    const { formItems, isDeleting, setFormItems, deleteDocument } = useDocumentsFormProvider();
    const { documentTypes } = useDocumentsProvider();
    const styles = useStyles();

    const updateDocumentType = (index: number, typeValue: string) => {
        const updatedFormItems = [...formItems];
        updatedFormItems[index].documentType = typeValue;
        setFormItems(updatedFormItems);
    };

    // const updateGroup = (index: number, groupValue: string) => {
    //     const updatedFormItems = [...formItems];
    //     updatedFormItems[index].group = groupValue;
    //     setFormItems(updatedFormItems);
    // };

    const columns: TableColumnDefinition<DocumentItem>[] = [
        createTableColumn<DocumentItem>({
            columnId: "file",
            renderHeaderCell: () => {
                return "File";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout>
                        {item.file?.name}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<DocumentItem>({
            columnId: "size",
            renderHeaderCell: () => {
                return "Size";
            },
            renderCell: (item) => {
                return (
                    <TableCellLayout>
                        {item.file ? bytesToSize(item.file.size) : 0}
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<DocumentItem>({
            columnId: "type",
            renderHeaderCell: () => {
                return "Document type";
            },
            renderCell: (item) => {
                const index = formItems.indexOf(item);
                return (
                    <CustomDropdown
                        index={index}
                        item={item}
                        type="documentType"
                        options={documentTypes}
                        updateValue={updateDocumentType}
                    />
                );
            },
        }),
        // createTableColumn<DocumentItem>({
        //     columnId: "group",
        //     renderHeaderCell: () => {
        //         return "PMW/FIO";
        //     },
        //     renderCell: (item) => {
        //         return (
        //             <TableCellLayout>
        //                 {item.group}
        //             </TableCellLayout>
        //         );
        //     },
        // }),
        createTableColumn<DocumentItem>({
            columnId: "actions",
            renderHeaderCell: () => {
                return "";
            },
            renderCell: (item) => {
                return (
                    <>
                        {!isDeleting ?
                            <Button
                                appearance="transparent"
                                icon={<DeleteRegular />}
                                onClick={() => deleteDocument(item)}
                            />
                            : <Spinner size="tiny" />
                        }
                    </>                    
                );
            },
        }),
    ];

    const columnSizingOptions = {
        file: {
            defaultWidth: 300,
            minWidth: 280,
            idealWidth: 300,
        },
        size: {
            defaultWidth: 100,
            minWidth: 75,
            idealWidth: 100,
        },        
        type: {
            defaultWidth: 275,
            minWidth: 250,
            idealWidth: 275,
        },
        // group: {
        //     defaultWidth: 175,
        //     minWidth: 150,
        //     idealWidth: 175,
        // },
        actions: {
            defaultWidth: 50,
            minWidth: 50,
            idealWidth: 50,
        },
    };

    const getCellFocusMode = (columnId: TableColumnId): DataGridCellFocusMode => {
        switch (columnId) {
            case "file":
                return "none";
            case "size":
                return "none";
            case "type":
                return "group";
            case "group":
                return "none";
            case "actions":
                return "group";
            default:
                return "cell";
        }
    };

    return (
        <div className={styles.form}>
            <>
                {formItems && formItems.length > 0 ?
                    <DataGrid
                        items={formItems}
                        columns={columns}
                        sortable
                        columnSizingOptions={columnSizingOptions}
                        resizableColumns
                    >
                        <DataGridHeader>
                            <DataGridRow>
                                {({ renderHeaderCell }) => (
                                    <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                                )}
                            </DataGridRow>
                        </DataGridHeader>
                        <DataGridBody<DocumentItem>>
                            {({ item, rowId }) => (
                                <DataGridRow>
                                    {({ renderCell, columnId }) => (
                                        <DataGridCell focusMode={getCellFocusMode(columnId)}>
                                            {renderCell(item)}
                                        </DataGridCell>
                                    )}
                                </DataGridRow>
                            )}
                        </DataGridBody>
                    </DataGrid>
                    : null}
            </>
        </div>
    );
};

export default DocumentForm;