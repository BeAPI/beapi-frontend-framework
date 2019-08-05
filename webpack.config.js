const config = require('./webpack.settings')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const SoundsPlugin = require('sounds-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')

const webpackConfig = {
  entry: config.entry,
  output: {
    path: config.assetsPath,
  },
  optimization: {},
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
            },
          },
          'resolve-url-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
            },
          },
          'sass-loader',
        ]
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
        to: './../',
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
    new WebpackProgressOraPlugin(),
  ],
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    webpackConfig.devtool = 'source-map'
    webpackConfig.output.filename = '[name].js'
    webpackConfig.plugins.push(
      new SoundsPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        allChunks: true,
      }),
      new BrowserSyncPlugin(
        {
          proxy: 'http://[::1]:' + config.port,
          files: [
            {
              match: config.refresh,
              fn: function(event, file) {
                const bs = require('browser-sync').get('bs-webpack-plugin')

                if (event === 'change' && file.indexOf('.css') === -1) {
                  bs.reload()
                }

                if (event === 'change' && file.indexOf('.css') !== -1) {
                  bs.stream()
                }
              },
            },
          ],
          startPath: '/dist/index.php',
          notify: true,
        },
        {
          reload: false,
          injectCss: true,
        }
      )
    )
  }

  if (argv.mode === 'production') {
    webpackConfig.optimization.minimizer = [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.min\.css$/,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
        },
      }),
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ]
    webpackConfig.output.filename = '[name].[chunkhash:8].min.js'
    webpackConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].min.css',
        allChunks: true,
      }),
      new ManifestPlugin({
        fileName: 'assets.json',
        filter: file => !file.isAsset,
      })
    )
  }

  return webpackConfig
}
