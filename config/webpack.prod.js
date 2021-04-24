const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const loaders = require('./loaders')
const plugins = require('./plugins')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash:8].min.js',
  },
  module: {
    rules: [loaders.SCSSLoaderProd, loaders.SVGLoader].concat(common.module.rules),
  },
  plugins: [plugins.ManifestPlugin, plugins.MiniCssExtractPluginProd],
})
