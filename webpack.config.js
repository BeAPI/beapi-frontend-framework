const fs = require('fs')
const config = require('./webpack.settings')
const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PhpOutputPlugin = require('./src/js/vendor/webpack-php-output')
const SoundsPlugin = require('sounds-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackProgressOraPlugin = require('webpack-progress-ora-plugin')
const getServerPort = function(portFile) {
  try {
    require('fs').accessSync(portFile, fs.R_OK | fs.W_OK)

    return parseInt(fs.readFileSync(portFile, 'utf8'))
  } catch (e) {
    return false
  }
}
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [require('autoprefixer')()],
            },
          },
          'resolve-url-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [require('autoprefixer')()],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
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
        from: 'src/img/static/',
        to: 'img/static/',
      },
      {
        from: 'src/img/sample/',
        to: 'img/sample/',
      },
    ]),
    new PhpOutputPlugin({
      devServer: false, // false or string with server entry point, e.g: app.js or
      outPutPath: path.resolve(__dirname, 'dist/'), // false for default webpack path of pass string to specify
      assetsPathPrefix: '',
      phpClassName: 'WebpackBuiltFiles', //
      phpFileName: 'WebpackBuiltFiles',
      nameSpace: false, // false {nameSpace: 'name', use: ['string'] or empty property or don't pass "use" property}
      path: '',
    }),
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
          port: getServerPort('./.bs-port') || 3000,
          proxy: 'http://[::1]:' + (getServerPort('./.port') || 9090),
          files: [
            {
              match: config.refresh,
              fn: function(event, file) {
                const bs = require('browser-sync').get('bs-webpack-plugin')

                if (event === 'change' && file !== 'dist/WebpackBuiltFiles.php' && file.indexOf('.css') === -1) {
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
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
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
