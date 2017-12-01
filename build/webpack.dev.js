const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackBase = require('./webpack.base')
const server = require('./server')
const build = process.env.NODE_BUILD === 'true'

let bs = build === 'true' ? server : ''

webpackBase.plugins.push(
  new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true
  })
)

module.exports = webpackBase
