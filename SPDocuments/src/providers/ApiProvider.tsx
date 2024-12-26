import * as React from 'react';
import { SpService } from "../api/SpService";
import { PcfContext } from '../types/AppProps';
import { DataverseService } from '../api/DataverseService';

type ApiModel = {
    spService: SpService;
    dataverseService: DataverseService;
};

type ApiProviderProps = {
    context: PcfContext;
    siteUrl: string;
    libraryName: string;
    clientId: string;
    recordId: string;
    children: React.ReactNode;
};

const Context = React.createContext({} as ApiModel);

const ApiProvider: React.FC<ApiProviderProps> = (props) => {
  const { context, siteUrl, libraryName, clientId, recordId, children } = props;
  const [spService] = React.useState<SpService>(new SpService(siteUrl, libraryName, clientId, recordId));
  const [dataverseService] = React.useState<DataverseService>(new DataverseService(context, recordId));

  return (
    <Context.Provider
      value={{
        spService,
        dataverseService,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useApiProvider = (): ApiModel => React.useContext(Context);
export { ApiProvider, useApiProvider };