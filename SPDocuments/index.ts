/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { MOCK_CLIENTID, MOCK_DOCTYPES, MOCK_LIBRARYNAME, MOCK_SHAREPOINT_URL } from "./src/shared/MockProps";
import App from "./src/App";
import { AppProps } from "./src/types/AppProps";

export class SPDocuments implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: AppProps = {
            context: context,
            clientId: context.parameters.clientId.raw ? context.parameters.clientId.raw : MOCK_CLIENTID,
            siteUrl: context.parameters.siteUrl.raw ? context.parameters.siteUrl.raw : MOCK_SHAREPOINT_URL,
            libraryName: context.parameters.libraryName.raw ? context.parameters.libraryName.raw : MOCK_LIBRARYNAME,
            recordId: (context.mode as any).contextInfo.entityId,
            documentTypes: context.parameters.documentTypes.raw ? context.parameters.documentTypes.raw.split(',') : MOCK_DOCTYPES.split(','),
        };
        return React.createElement(
            App, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private _isSandbox(): boolean {
        return window?.location?.href?.toLowerCase().indexOf("dynamics.com") < 0;
    }
}
