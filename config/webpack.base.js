const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const SvgStore = require('webpack-svgstore-plugin')
const cssLoaders = require('./css-loader.js')
const htmlRender = require('./html-render.js')('./../src/templates/', ['pages', 'partials'])

let root = path.resolve(__dirname)

let webpackBase = {
  devtool: config.dev ? 'source-map' : false,
  entry: config.entry,
  output: {
    path: config.assetsPath,
    publicPath: config.assetsPublicPath,
    filename: config.dev ? '[name].js' : '[name].[chunkhash:8].min.js',
  },
  devServer: config.devServer,
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: true,
            self: true,
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: root,
        enforce: 'pre',
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
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [...cssLoaders, 'sass-loader'],
          })
        ),
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
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
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
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/js/vendor_async/',
        to: 'js/vendor_async/',
      },
      {
        from: 'src/icons/',
        to: 'icons/',
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
    new SvgStore(
      path.resolve(__dirname, './../src/img/icons/*.svg'),
      path.resolve(__dirname, './../dist/assets/icons/'),
      {
        name: 'icons',
        prefix: 'icon-',
        chunk: 'svg',
        svgoOptions: {
          plugins: [
            {
              removeTitle: true,
            },
          ],
        },
      }
    ),
    new HtmlWebpackHarddiskPlugin(),
  ].concat(htmlRender),
}

module.exports = webpackBase
