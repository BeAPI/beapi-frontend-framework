const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpackBase = require('./webpack.base')

webpackBase.plugins.push(
  new CleanWebpackPlugin(['dist/assets'], {
    root: path.resolve('./'),
    verbose: true,
    dry: false,
  }),
  new ExtractTextPlugin({
    filename: '[name].[contenthash:8].min.css',
    allChunks: true,
  }),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.min\.css$/,
    cssProcessorOptions: {
      discardComments: {
        removeAll: true,
      },
    },
  }),
  new UglifyJsPlugin({
    sourceMap: true,
  }),
  new ManifestPlugin({
    fileName: 'assets.json',
  })
)

module.exports = webpackBase
