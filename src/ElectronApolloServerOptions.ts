import { IResolvers } from 'graphql-tools/dist/Interfaces';

/** Options for Apollo server implementation for Electron Main Process */
export interface ElectronApolloServerOptions {
    /** Path to file with type definitions */
    typeDefsFilePath?: string;
    /** Type definitions as string */
    typeDefs?: string;
    /** Schema resolvers */
    resolvers: IResolvers;
}
