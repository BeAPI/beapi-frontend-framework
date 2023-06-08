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
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      /* ImagesLoader */ {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        exclude: /icons/,
        include: srcPath + '/img',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
      /* JSLoader */ {
        test: /\.js$/i,
        include: srcPath + '/js',
        use: {
          loader: 'esbuild-loader',
          options: {
            loader: 'js',
            target: 'es2016',
            legalComments: 'inline',
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
              url: true,
              esModule: false,
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
                  quietDeps: true,
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
              publicPath: 'icons/',
              spriteFilename: (svgPath) => `${/icons([\\|/])(.*?)\1/gm.exec(svgPath)[2]}.svg`,
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
