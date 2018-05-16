'use strict';

const del = require('del');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

function main() {
    return new Promise((resolve) => {
        del([path.join(DIST_DIR, '**', '*')], resolve);
    });
}

main().then(
    (files) => console.log(`Deleted files:\n\n${files.join('\n')}`)
);
