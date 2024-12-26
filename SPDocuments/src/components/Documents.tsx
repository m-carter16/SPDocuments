import * as React from 'react';
import { Button, Divider, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Input, Spinner, Subtitle1 } from '@fluentui/react-components';
import { SearchRegular, Dismiss24Regular, SaveRegular } from "@fluentui/react-icons";
import { useForceUpdate } from '../hooks/useForceupdate';
import CommandBar from './CommandBar';
import { useFilterProvider } from '../providers/FilterProvider';
import DocumentForm from './DocumentForm';
import { DocumentItem } from '../types/DocumentTypes';
import { useDocumentsProvider } from '../providers/DocumentsProvider';
import DragDrop from './DragDrop';
import { useDocumentsFormProvider } from '../providers/DocumentsFormProvider';

const Documents: React.FC = () => {
  const { recordId, isSelected, getDocuments } = useDocumentsProvider();
  const { formItems, isPanelOpen, ensureFolders, createDocument, updateDocument, setFormItems, setIsPanelOpen } = useDocumentsFormProvider();
  const { setSearchValue } = useFilterProvider();
  const [submitting, setSubmitting] = React.useState(false);
  const forceUpdate = useForceUpdate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newFiles = Array.from(e.target.files as ArrayLike<File>);
    const _items: DocumentItem[] = [];
    newFiles.map((file) => {
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

  const handleSubmit = async () => {
    setSubmitting(true);
    const folders = await ensureFolders(formItems[0]);
    const promises = formItems.map((item) => {
      if (item.id && folders.groupFolder && folders.recordFolder) {
        updateDocument(item);
      } else {
        createDocument(item, folders.recordFolder);
      }
    });
    await Promise.all(promises);
    setSubmitting(false);
    getDocuments();
    forceUpdate();
    setIsPanelOpen(false);
  };

  return (
    <>
      <div style={{ margin: '10px', display: 'flex', justifyContent: "center" }}>
        <Input
          style={{ width: '400px' }}
          contentBefore={<SearchRegular />}
          placeholder="Search documents"
          onChange={(ev, data) => setSearchValue(data.value)}
        />
      </div>
      <div style={{ margin: "0 14px" }}>
        <CommandBar
          isSelected={isSelected}
          setIsOpen={setIsPanelOpen}
          handleFilePicker={handleFileChange}
        />
        <Divider />
        <div style={{ margin: "0 14px" }}>
          <div style={{ margin: "14px 0" }}>
            <Subtitle1>Documents</Subtitle1>
          </div>
          <DragDrop />
        </div>
      </div>
      <Drawer
        type="overlay"
        position="end"
        size="large"
        separator
        open={isPanelOpen}
        onOpenChange={(_, { open }) => setIsPanelOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsPanelOpen(false)}
              />
            }
          >
            Default Drawer
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <DocumentForm />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px", }}>
            <Button
              appearance="primary"
              icon={submitting ? <Spinner size="tiny" /> : <SaveRegular />}
              onClick={handleSubmit}>
              Save files
            </Button>
          </div>
        </DrawerBody>
      </Drawer>
    </>
  );
};

export default Documents;
