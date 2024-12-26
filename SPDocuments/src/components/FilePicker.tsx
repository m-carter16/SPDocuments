import * as React from "react";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { Button, Text } from "@fluentui/react-components";
import { DeleteRegular } from '@fluentui/react-icons';

interface FilePickerProps {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilePicker: React.FC<FilePickerProps> = (props) => {
    const { handleFileChange } = props;
    const fileUploadRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = (): void => {
        if (fileUploadRef.current) {
            fileUploadRef.current.click();
        }
    };

    return (
        <div>
            <Button
                appearance="primary"
                // icon={<ArrowDownloadRegular />}
                onClick={handleUpload}
            >
                Choose file(s)
            </Button>
            <input
                ref={fileUploadRef}
                type="file"
                multiple={true}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FilePicker;