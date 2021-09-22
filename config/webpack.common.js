const path = require('path')
const entries = require('./entries')
const loaders = require('./loaders')
const plugins = require('./plugins')

module.exports = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  externals: {
    jquery: 'window.jQuery',
  },
  module: {
    rules: [loaders.FontsLoader, loaders.ImagesLoader, loaders.JSLoader],
  },
  plugins: [
    plugins.CleanWebpackPlugin,
    plugins.ESLintPlugin,
    plugins.SpriteLoaderPlugin,
    plugins.StyleLintPlugin,
    plugins.WebpackBar,
  ],
}
