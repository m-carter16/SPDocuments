import * as React from 'react';
import { FluentProvider, Theme, webLightTheme } from '@fluentui/react-components';
import { FilterProvider } from './providers/FilterProvider';
import Documents from './components/Documents';
import { AppProps } from './types/AppProps';
import { ApiProvider } from './providers/ApiProvider';
import { DocumentsProvider } from './providers/DocumentsProvider';
import { DocumentsFormProvider } from './providers/DocumentsFormProvider';

const App: React.FC<AppProps> = (props) => {
    const { context, siteUrl, libraryName, clientId, recordId, documentTypes } = props;
    const activetheme: Theme = webLightTheme;
    return (
        <div style={{ width: '100%'}}>
            <FluentProvider theme={activetheme}>
                <ApiProvider
                    context={context}
                    siteUrl={siteUrl}
                    libraryName={libraryName}
                    clientId={clientId}
                    recordId={recordId}
                >
                    <DocumentsProvider recordId={recordId} documentTypes={documentTypes}>
                        <DocumentsFormProvider >
                            <FilterProvider>
                                <Documents {...props} />
                            </FilterProvider>
                        </DocumentsFormProvider>
                    </DocumentsProvider>
                </ApiProvider>
            </FluentProvider>
        </div>
    );
};

export default App;
