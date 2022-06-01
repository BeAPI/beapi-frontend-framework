const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const srcPath = path.resolve(__dirname, '../src')

const SCSSLoader = {
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
          const isProduction = loaderContext.mode === 'production'
          const isEditor = loaderContext.resource.indexOf('editor.scss') > -1
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

          if (isProduction && !isEditor) {
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
          const isProduction = loaderContext.mode === 'production'
          const isEditor = loaderContext.resource.indexOf('editor.scss') > -1
          let obj = {
            sourceMap: true,
          }

          if (isProduction && isEditor) {
            obj.outputStyle = 'expanded'
          }

          return obj
        },
      },
    },
  ],
}

const FontsLoader = {
  test: /\.(woff|woff2)$/,
  type: 'asset/resource',
  include: srcPath + '/fonts',
}

const ImagesLoader = {
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
}

const JSLoader = {
  test: /\.js$/i,
  include: srcPath + '/js',
  use: {
    loader: 'esbuild-loader',
    options: {
      loader: 'js',
      target: 'es2016',
    },
  },
}

const SVGLoader = {
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
}

module.exports = {
  get: function () {
    return [FontsLoader, ImagesLoader, JSLoader, SCSSLoader, SVGLoader]
  },
}
