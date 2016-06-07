var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        './index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Behavox',
            template: './index.html',
            inject: 'body'
        }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('style.css')
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules|mock/
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.styl/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!stylus?resolve url')
            }]
    }
};