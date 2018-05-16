import autobind from 'autobind-decorator';
import { ipcRenderer } from 'electron';
import { v4 } from 'uuid';
import { GraphQLRequest, ExecutionResult } from 'apollo-link';
import { APOLLO_REQUEST_EVENT_TYPE, APOLLO_RESPONSE_EVENT_TYPE } from './constants';
import { ElectronIpcLinkOptions } from './ElectronIpcLinkOptions';

/** GraphQL client */
export class ElectronGraphqlClient {
    /** Electron GraphQL Link options */
    protected options: ElectronIpcLinkOptions;
    protected responseHandlers: {
        [uuid: string]: (data: ExecutionResult) => void;
    };
    /** @constructor */
    public constructor(options: Partial<ElectronIpcLinkOptions> = {}) {
        this.options = {
            requestEventType: APOLLO_REQUEST_EVENT_TYPE,
            responseEventType: APOLLO_RESPONSE_EVENT_TYPE,
            ...options,
        };
        this.responseHandlers = {};
    }
    /** Initialize */
    public init(): void {
        ipcRenderer.on(this.options.responseEventType, this.onResponse);
    }
    /** Fetch data */
    public fetch(body: Partial<GraphQLRequest>): Promise<ExecutionResult> {
        const uuid: string = v4();
        return new Promise<any>(resolve => {
            this.responseHandlers[uuid] = (response) => resolve(response);
            ipcRenderer.send(this.options.requestEventType, uuid, body);
        });
    }
    /** Common response event handler */
    @autobind
    protected onResponse(event: any, uuid: string, data: ExecutionResult): void {
        if (Boolean(this.responseHandlers[uuid])) {
            this.responseHandlers[uuid](data);
            delete this.responseHandlers[uuid];
        }
    }
}
