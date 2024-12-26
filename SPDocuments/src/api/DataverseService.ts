import { PcfContext } from "../types/AppProps";

export class DataverseService {
    private _recordId: string;
    private _context: PcfContext;

    constructor(context: PcfContext, recordId: string){
        this._context = context;
        this._recordId = recordId;
    }

    public getRecord = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entity = (this._context.mode as any).contextInfo.entityTypeName;
        const record = await this._context.webAPI.retrieveRecord(entity, this._recordId);
        return record;
    };

}