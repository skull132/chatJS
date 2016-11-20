const webpack = require('webpack');

module.exports = {
    entry: './src/chatJs.js',
    output: {
        path: "./dist/",
        filename: 'chatJs.min.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccuranceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
    ]
};