const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const pathsTransformer = require('ts-transform-paths').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: () => pathsTransformer(),
                },
            },
        ],
    },
    output: {
        clean: true,
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'video-brightness-sampler',
            type: 'umd',
        },
    },
    devServer: {
        open: true,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3000,
        watchFiles: ['src/**/*'],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({ inject: 'body' }),
    ],
};