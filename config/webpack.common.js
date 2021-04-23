const path = require('path')
const entries = require('./entries')
const loaders = require('./loaders')
const plugins = require('./plugins')

module.exports = {
  entry: entries,
  module: {
    rules: [loaders.FontsLoader, loaders.JSLoader, loaders.SCSSLoader, loaders.SVGLoader],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
  },
  plugins: [
    plugins.CleanWebpackPlugin,
    plugins.ESLintPlugin,
    plugins.SpriteLoaderPlugin,
    plugins.StyleLintPlugin,
    plugins.WebpackBar,
  ],
}
