const path = require('path');

module.exports = {
    entry: {
        content: './src/tests.js'
    },
    optimization: {
        minimize: false
    },
    output: {
        filename: 'tests.js',
        path: __dirname + '/tests/',
    },
};