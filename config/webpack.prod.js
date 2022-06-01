const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const plugins = require('./plugins')

module.exports = merge(common, {
  mode: 'production',
  stats: 'minimal',
  output: {
    filename: '[name].[chunkhash:8].min.js',
  },
  plugins: plugins.get('production'),
})
