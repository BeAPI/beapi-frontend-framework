const path = require('path')
const entries = require('./entries')
const loaders = require('./loaders')

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
    rules: loaders.get(),
  },
}
