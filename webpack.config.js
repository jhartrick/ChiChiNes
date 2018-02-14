const path = require('path');

const configChiChi = {
    entry: {
        chichi: './chichi/chichi.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'chichi',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: [ '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}

module.exports = [configChiChi];
