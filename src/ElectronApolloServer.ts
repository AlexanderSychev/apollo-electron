import autobind from 'autobind-decorator';
import isNil from 'lodash.isnil';
import { ipcMain } from 'electron';
import { readFileSync } from 'fs';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLRequest } from 'apollo-link';
import { APOLLO_RESPONSE_EVENT_TYPE, APOLLO_REQUEST_EVENT_TYPE } from './constants';
import { ElectronIpcLinkOptions } from './ElectronIpcLinkOptions';
import { ElectronApolloServerOptions } from './ElectronApolloServerOptions';

/** Apollo server implementation for Electron Main Process */
export class ElectronApolloServer {
    /** Executable GraphQL Schema */
    protected schema: GraphQLSchema;
    /** Apollo Link Electron options */
    protected linkOptions: ElectronIpcLinkOptions;
    /** @constructor */
    constructor(serverOptions: ElectronApolloServerOptions, linkOptions: Partial<ElectronIpcLinkOptions> = {}) {
        let typeDefs: string | undefined = undefined;

        if (!isNil(serverOptions.typeDefsFilePath)) {
            typeDefs = readFileSync(serverOptions.typeDefsFilePath, 'utf-8');
        } else if (!isNil(serverOptions.typeDefs)) {
            typeDefs = serverOptions.typeDefs;
        } else {
            throw new Error(
                'Type definitions must be defined in file ("typeDefsFilePath" field) or in string ("typeDefs")',
            );
        }

        this.schema = makeExecutableSchema({
            typeDefs,
            resolvers: serverOptions.resolvers,
        });

        this.linkOptions = {
            requestEventType: APOLLO_REQUEST_EVENT_TYPE,
            responseEventType: APOLLO_RESPONSE_EVENT_TYPE,
            ...linkOptions,
        };
    }
    /** Start server */
    public start(): void {
        ipcMain.on(this.linkOptions.requestEventType, this.onRequest);
    }
    /** Stop server */
    public stop(): void {
        ipcMain.removeListener(this.linkOptions.requestEventType, this.onRequest);
    }
    /** Request main handler */
    @autobind
    protected async onRequest(event: any, callbackId: string, data: Partial<GraphQLRequest>): Promise<void> {
        event.sender.send(this.linkOptions.responseEventType, callbackId, data);
    }
}
