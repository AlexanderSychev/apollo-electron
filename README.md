# apollo-electron

Complete pack of utilities to use Apollo with Electron IPC.
Includes server, client and link.

## Usage

Create GraphQL Server in Main Process:

```typescript
// Based on Electron first app example:
// https://electronjs.org/docs/tutorial/first-app

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { ElectronApolloServer } from 'apollo-electron/server';

// "server" and "win" variable should have same behavior
let win: BrowserWindow | null = null;
let server: ElectronApolloServer | null = null;

// Your type definitions
const typeDefs: string = `
    type Query {
        foo: String
    }
`;

// Your resolvers
const resolvers = {
    Query: {
        foo: () => 'foo',
    },
};

function createWindow() {
    main.info('Window will be opened');

    win = new BrowserWindow({ width: 1024, height: 768 });
    // Create and start server
    server = new ElectronApolloServer({ typeDefs, resolvers });
    server.start();

    win!.loadURL(
        url.format({
            pathname: path.resolve(__dirname, '..', '..', 'www', 'index.html'),
            protocol: 'file:',
            slashes: true,
            hash: '/'
        }),
    );

    win!.webContents.openDevTools();

    win!.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (server) {
            // Stop server before quit!
            server!.stop();
            server = null;
        };
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
```

Create Electron Apollo Link in Render Process:

```typescript
import { ApolloClient } from 'apollo-client';
import { ElectronIpcLink } from 'apollo-electron/client';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const apolloClient = new ApolloClient({
    link: new ElectronIpcLink(), // Just use this link
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
```

## Using with Webpack

If you are using Webpack for frontend scripts (render process),
you can't add `electron` package at your bundle.
To resolve this problem you can use workaround

Require `electron` package in embedded script in your's application page.
This code must be **before** bundle code:

```html
<script type="text/javascript">
    window.__ELECTRON__ = require('electron');
</script>
<script type="text/javascript" src="/path/to/your/bundle"></script> 
```

Add `electron` package as external library:

```javascript
module.exports = {
    // ...
    // Your bundle settings
    // ...
    externals: {
        // ...
        // Other externals settings
        // ...
        electron: 'window.__ELECTRON__',
    },
};
```
