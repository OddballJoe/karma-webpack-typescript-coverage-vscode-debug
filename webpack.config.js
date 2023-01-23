const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    devtool: 'inline-source-map',

    entry: [
        './src/index.ts',
    ],

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/, use: [{
                    loader: 'ts-loader'
                }]
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                'app/index.html'
            ]
        })
    ],
    devServer: {
        host: 'localhost'
    }
};