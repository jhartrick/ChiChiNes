module.exports = {
    entry: {
        chichi: './chichi/chichi.ts',
        debugger: './debugger/debug.interface.ts'
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
