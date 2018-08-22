const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackBase = require('./webpack.base')

webpackBase.plugins.push(
  new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true,
  })
)

module.exports = webpackBase
