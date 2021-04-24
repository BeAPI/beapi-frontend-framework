const path = require('path')
const entries = require('./entries')
const plugins = require('./plugins')

module.exports = {
  entry: entries,
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
