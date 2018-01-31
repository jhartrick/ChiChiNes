const path = require('path');

const configChiChi = {
    entry: {
        chichi: './chichi/chichi.ts'
    },
    output: {
        filename: '[name].js',
        library: 'chichi',
        libraryTarget: 'commonjs2'
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

const configChiChiWorker = {
    entry: {
        'emulator.worker': './workers/emulator.worker.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/workers'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        library: 'emulator.worker',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}

const configRomLoader = {
    entry: {
        'romloader.worker': './romloader/romloader.worker.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/workers'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        library: 'romloader',
        libraryTarget: 'umd'

    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}

module.exports = [configChiChi];
