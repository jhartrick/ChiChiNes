module.exports = {
    entry: './chichi/ChiChi.ts',
    output: {
        filename: 'chichi.js',
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