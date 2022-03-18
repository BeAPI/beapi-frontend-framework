const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const SCSSLoaderDev = {
  test: /\.(scss|css)$/,
  exclude: /node_modules/,
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
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.dev.config.js'),
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
}

const SCSSLoaderProd = {
  test: /\.(scss|css)$/,
  exclude: /node_modules/,
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
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.prod.config.js'),
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
}

const FontsLoader = {
  test: /\.(woff|woff2)$/,
  type: 'asset/resource',
}

const ImagesLoader = {
  test: /\.(png|jpe?g|gif|svg)$/,
  type: 'asset/resource',
  exclude: /icons/,
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
  exclude: /node_modules/,
  use: {
    loader: 'esbuild-loader',
    options: {
      loader: 'js',
      target: 'es2016',
    },
  },
}

const SVGLoader = {
  test: /icons\/.*\.svg$/,
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
  FontsLoader,
  ImagesLoader,
  JSLoader,
  SCSSLoaderDev,
  SCSSLoaderProd,
  SVGLoader,
}
