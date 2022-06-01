const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const srcPath = path.resolve(__dirname, '../src')

function isEditor(loaderContext) {
  return loaderContext.resource.indexOf('editor.scss') > -1
}

module.exports = {
  get: function (mode) {
    const isProduction = mode === 'production'

    return [
      /* FontsLoader */ {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource',
        include: srcPath + '/fonts',
      },
      /* ImagesLoader */ {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        exclude: /icons/,
        include: srcPath + '/img',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              pngquant: {
                quality: [0.65, 0.9],
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
      /* JSLoader */ {
        test: /\.js$/i,
        include: srcPath + '/js',
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'js',
            target: 'es2016',
          },
        },
      },
      /* SCSSLoader */ {
        test: /\.(scss|css)$/,
        include: srcPath + '/scss',
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: function (loaderContext) {
                let obj = {
                  plugins: {
                    'postcss-import': {},
                    'postcss-preset-env': {
                      browsers: 'last 2 versions',
                      stage: 0,
                    },
                    'postcss-pxtorem': { propWhiteList: [] },
                    'postcss-sort-media-queries': {},
                  },
                }

                if (isProduction && !isEditor(loaderContext)) {
                  obj.plugins.cssnano = {}
                }

                return obj
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: function (loaderContext) {
                let obj = {
                  sourceMap: true,
                }

                if (isProduction && isEditor(loaderContext)) {
                  obj.outputStyle = 'expanded'
                }

                return obj
              },
            },
          },
        ],
      },
      /* SVGLoader */ {
        test: /\.svg$/,
        include: srcPath + '/img/icons',
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              publicPath: 'img/icons/',
              spriteFilename: (svgPath) => `icons${svgPath.substr(-4)}`,
              symbolId: (filePath) => `icon-${path.basename(filePath).slice(0, -4)}`,
            },
          },
          {
            loader: 'svgo-loader',
          },
        ],
      },
    ]
  },
}
