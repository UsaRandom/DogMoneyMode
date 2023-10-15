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
                    from: `./src/chrome-manifest.json`,
                    to: '../manifest.json',
                },
                {
                    from: `./src/popup.html`,
                    to: '../popup.html',
                },
                {
                    from: `./src/wow.mp3`,
                    to: '../wow.mp3',
                },
                {
                    from: './src/images/*.png',
                    to: '../images/[name][ext]',
                },
                {
                    from: './src/styles/*.css',
                    to: '../styles/[name][ext]',
                }
            ],
        }),
    ],
};
