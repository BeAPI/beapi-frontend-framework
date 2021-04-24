const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const loaders = require('./loaders')
const plugins = require('./plugins')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
  },
  module: {
    rules: [loaders.SCSSLoaderDev, loaders.SVGLoader].concat(common.module.rules),
  },
  plugins: [plugins.BrowserSyncPlugin, plugins.MiniCssExtractPluginDev],
})
