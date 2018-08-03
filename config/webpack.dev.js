const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack')
const imagesSizes = require('./../tasks/image-sizes')
const webpackBase = require('./webpack.base')

webpackBase.plugins.push(
  new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true,
  }),
  new WebpackOnBuildPlugin(function() {
    imagesSizes()
  })
)

module.exports = webpackBase
