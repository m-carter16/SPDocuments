import * as React from 'react';
import { Button, Spinner, Toolbar } from '@fluentui/react-components';
import { ArrowUploadRegular, DocumentEditRegular, DeleteRegular, ArrowDownloadRegular } from '@fluentui/react-icons';
import { CommandBarProps } from '../types/CommandBarProps';
import { useDocumentsProvider } from '../providers/DocumentsProvider';
import { useDocumentsFormProvider } from '../providers/DocumentsFormProvider';

const CommandBar: React.FC<CommandBarProps> = (props) => {
    const { handleFilePicker } = props;
    const { isSelected } = useDocumentsProvider();
    const { formItems, setIsPanelOpen, deleteDocument } = useDocumentsFormProvider();
    const [deletingFiles, setDeletingFiles] = React.useState<boolean>(false);
    const fileUploadRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = (): void => {
        if (fileUploadRef.current) {
            fileUploadRef.current.click();
        }
    };

    const handleDelete = () => {
        setDeletingFiles(true);
        formItems.map((item) => {
            deleteDocument(item)
        });
        setDeletingFiles(false);
    };

    return (
        <Toolbar>
            <div style={{ margin: '5px' }}>
                <Button
                    appearance="primary"
                    icon={<ArrowUploadRegular />}
                    onClick={handleUpload}
                >
                    Upload
                </Button>
                <input
                    ref={fileUploadRef}
                    type="file"
                    multiple={true}
                    style={{ display: 'none' }}
                    onChange={handleFilePicker}
                />
            </div>

            {isSelected &&
                <Button
                    appearance="subtle"
                    icon={<DocumentEditRegular />}
                    onClick={() => setIsPanelOpen(true)}>
                    Edit
                </Button>}
            {isSelected &&
                <Button
                    appearance="subtle"
                    icon={deletingFiles ? <Spinner size="tiny" /> : <DeleteRegular />}
                    onClick={handleDelete}>
                    Delete
                </Button>}
            {isSelected && <Button appearance="subtle" icon={<ArrowDownloadRegular />} disabled >Download</Button>}
        </Toolbar>
    );
};

export default CommandBar;