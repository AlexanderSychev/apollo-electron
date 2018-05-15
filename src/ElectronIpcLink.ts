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
            observer.complete();
        });
    }
}
