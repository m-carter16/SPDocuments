import { spfi, SPBrowser, SPFI } from "@pnp/sp";
import { MSAL, MSALOptions,  } from "@pnp/msaljsclient";
import { ConsoleListener, Logger, LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/batching";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/sites";
import "@pnp/sp/fields";
import "@pnp/sp/files";
import "@pnp/sp/folders";

let _sp: SPFI;
const LOG_SOURCE = "SPDocuments_PCF";
Logger.subscribe(ConsoleListener(LOG_SOURCE, {color: '#0b6a0b'}));

export const getBaseUrl = (siteUrl: string) => {
    const parsedUrl = new URL(siteUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    return baseUrl
};

export const getSP = (siteUrl: string, clientId: string) => {
    if (siteUrl) {
        const baseUrl = getBaseUrl(siteUrl);

        const options: MSALOptions = {
            configuration: {
                auth: {
                    authority: "https://login.microsoftonline.com/common",
                    clientId: clientId,
                }
            },
            authParams: {
                scopes: [`${baseUrl}/.default`],
            }
        };

        _sp = spfi(siteUrl).using(SPBrowser(), MSAL(options));
    }
        return _sp;
}