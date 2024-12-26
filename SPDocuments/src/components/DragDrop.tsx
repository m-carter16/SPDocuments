import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { useDocumentsProvider } from '../providers/DocumentsProvider';
import { Spinner } from '@fluentui/react-components';
import { DocumentItem } from '../types/DocumentTypes';
import DocumentList from './DocumentList';
import { useDocumentsFormProvider } from '../providers/DocumentsFormProvider';

const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'border .24s ease-in-out',
    padding: "20px",
    fontSize: "20px",
    fontWeight: 600,
    minHeight: '375px',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 2,
    borderStyle: 'dashed',
};

const acceptStyle = {    
    backgroundColor: '#fafafa',
    borderColor: '#0f6cbd',
    borderWidth: 2,
    borderRadius: 2,
    borderStyle: 'dashed',
};

const DragDrop: React.FC = () => {
    const { items, recordId, isLoading } = useDocumentsProvider();
    const { setFormItems, setIsPanelOpen } = useDocumentsFormProvider();
    const { getRootProps, getInputProps, isDragAccept } = useDropzone(
        {
            noClick: true,
            onDrop: (files) => handleDrop(files)
        }
    );

    const style = React.useMemo(() => ({
        ...baseStyle,
        ...(isDragAccept ? acceptStyle : {}),
    }), [
        isDragAccept,
    ]);

    const handleDrop = (files: File[]) => {
        const _items: DocumentItem[] = [];
        files.map(file => {
            _items.push({
                documentType: "",
                group: "",
                recordId: recordId,
                file: file,
                filePath: "",
                fileType: ""
            });
        });
        setFormItems(_items);
        setIsPanelOpen(true);
    };

    if (isLoading) {
        return (
            <Spinner appearance="primary" label="Getting documents for this record" />
        );
    }

    return (
        <div>
            {items.length === 0 ?
                <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <div>
                        <img
                            height={200}
                            width="auto"
                            src="https://res-1.cdn.office.net/files/fabric-cdn-prod_20240610.001/office-ui-fabric-react-assets/images/emptyfolder/empty_folder_drop.svg"
                        />
                        <div style={{display: 'flex', justifyContent: "center" }}>
                            Drag files here
                        </div>
                    </div>
                </div>
                :
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <DocumentList />
                </div>}
        </div>
    );
}

export default DragDrop;
