const config = require('./config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssLoaders = require('./css-loader.js')

let webpackBase = {
  devtool: config.dev ? 'source-map' : false,
  entry: config.entry,
  output: {
    path: config.assets_path,
    publicPath: config.assets_public_path,
    filename: config.dev ? '[name].js' : '[name].[chunkhash:8].min.js',
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
            },
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'resolve-url-loader'],
        }),
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: [
            ...cssLoaders,
            {
              loader: 'sass-loader',
              options: {
                sourceMap: config.dev,
              },
            },
          ],
        }),
      },
      {
        test: /\.(woff2?|woff|eot|ttf|otf|mp3|wav)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './fonts/',
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/js/vendor_async',
        to: 'js/vendor_async',
      },
      {
        from: 'src/js/vendor_ie',
        to: 'js/vendor_ie',
      },
      {
        from: 'src/templates/',
        to: '..',
      },
      {
        from: 'src/fonts/',
        to: 'fonts/',
      },
      {
        from: 'src/img/bg-sample/',
        to: 'img/bg-sample/',
      },
      {
        from: 'src/img/sample/',
        to: 'img/sample/',
      },
    ]),
  ],
}

module.exports = webpackBase
