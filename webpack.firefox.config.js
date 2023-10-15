const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        content: './src/content.js',
        popup: './src/popup.js',
        background: './src/background.js'
    },
    optimization: {
        minimize: false
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build/scripts'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: `./src/firefox-manifest.json`,
                    to: '../manifest.json',
                },
            ],
        }),
    ],
};
