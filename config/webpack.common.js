const path = require('path')
const entries = require('./entries')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const svgoconfig = require('./svgo.config')

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
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuratio
              ['svgo', { svgoconfig }],
            ],
          },
        },
      }),
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
