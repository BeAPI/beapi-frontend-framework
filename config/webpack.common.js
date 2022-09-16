const path = require('path')
const entries = require('./entries')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: /translators:/i,
          },
          compress: {
            passes: 2,
          },
          mangle: {
            reserved: ['__', '_n', '_nx', '_x'],
          },
        },
        extractComments: false,
      }),
    ],
  },
  externals: {
    jquery: 'window.jQuery',
  },
}
