# apollo-electron

Complete pack of utilities to use Apollo with Electron IPC.
Includes server, client and link.

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
