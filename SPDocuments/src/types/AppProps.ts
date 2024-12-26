import { IInputs } from "../../generated/ManifestTypes";

export type AppProps = {
    context: PcfContext;
    clientId: string;
    libraryName: string;
    siteUrl: string;
    recordId: string;
    documentTypes: string[];
}

export type PcfContext = ComponentFramework.Context<IInputs> 