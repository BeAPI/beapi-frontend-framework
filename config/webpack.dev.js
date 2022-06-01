const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const plugins = require('./plugins')

module.exports = merge(common, {
  mode: 'development',
  stats: 'errors-only',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
  },
  plugins: plugins.get('development'),
})
