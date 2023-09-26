const path = require('path');

module.exports = {
    entry: {
        content: './src/content.js',
        popup: './src/popup.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build/scripts',
    },
};