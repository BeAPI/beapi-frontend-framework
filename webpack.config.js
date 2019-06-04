const config = require('./webpack.settings')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')

const webpackConfig = {
  entry: config.entry,
  output: {
    path: config.assetsPath,
    publicPath: config.assetsPublicPath,
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
        ]
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
        to: config.assetsDirectory + 'js/vendor_async',
      },
      {
        from: 'src/js/vendor_ie',
        to: config.assetsDirectory + 'js/vendor_ie',
      },
      {
        from: 'src/templates/',
        to: './',
      },
      {
        from: 'src/fonts/',
        to: config.assetsDirectory + 'fonts/',
      },
      {
        from: 'src/img/bg-sample/',
        to: config.assetsDirectory + 'img/bg-sample/',
      },
      {
        from: 'src/img/sample/',
        to: config.assetsDirectory + 'img/sample/',
      },
    ]),
    new WebpackProgressOraPlugin()
  ],
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    webpackConfig.devtool = 'source-map'
    webpackConfig.output.filename = config.assetsDirectory + '[name].js'
    webpackConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: config.assetsDirectory + '[name].css',
        allChunks: true,
      }),
      new BrowserSyncPlugin(
        {
          proxy: 'http://[::1]:' + config.port,
          files: [
            {
              match: config.refresh,
              fn: function(event, file) {
                if (event === 'change') {
                  const bs = require('browser-sync').get('bs-webpack-plugin')
                  if (file.indexOf('.css') >= 0) {
                    bs.reload('*.css')
                  } else {
                    bs.reload()
                  }
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
    webpackConfig.output.filename = config.assetsDirectory + '[name].[chunkhash:8].min.js'
    webpackConfig.plugins.push(
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: config.assetsDirectory + '[name].[contenthash:8].min.css',
        allChunks: true,
      }),
      new ManifestPlugin({
        fileName: config.assetsDirectory + 'assets.json',
        filter: file => !file.isAsset,
      })
    )
  }

  return webpackConfig
}
