import { ApolloLink, Operation, Observable, FetchResult } from 'apollo-link';
import { ElectronIpcLinkOptions } from './ElectronIpcLinkOptions';
import { ElectronGraphqlClient } from './ElectronGraphqlClient';

/** Stateless link for Apollo */
export class ElectronIpcLink extends ApolloLink {
    /** Options for this link */
    protected client: ElectronGraphqlClient;
    /** @constructor */
    public constructor(options?: Partial<ElectronIpcLinkOptions>) {
        super();
        this.client = new ElectronGraphqlClient(options);
    }
    /** @override */
    public request(operation: Operation): Observable<FetchResult> {
        return new Observable(observer => {
            const { operationName, variables, query } = operation;
            this.client
                .fetch({ operationName, variables, query })
                .then(response => {
                    operation.setContext(response);
                    return response;
                })
                .then(response => {
                    observer.next(response);
                    observer.complete();
                })
                .catch(err => {
                    observer.error(err);
                });
            observer.complete();
        });
    }
}
