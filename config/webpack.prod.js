const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const plugins = require('./plugins')
const loaders = require('./loaders')
const mode = 'production'

module.exports = merge(common, {
  mode: mode,
  stats: 'minimal',
  output: {
    filename: '[name].[chunkhash:8].min.js',
  },
  plugins: plugins.get(mode),
  module: {
    rules: loaders.get(mode),
  },
})
