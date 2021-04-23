const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const SCSSLoader = {
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
          config: path.resolve(__dirname, 'postcss.config.js'),
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
  test: /\.(woff2?|woff|eot|ttf|otf|mp3|wav)(\?.*)?$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: './fonts/',
    },
  },
}

const JSLoader = {
  test: /\.js$/i,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: true,
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
        spriteFilename: svgPath => `icons${svgPath.substr(-4)}`,
        symbolId: filePath => `icon-${path.basename(filePath).slice(0, -4)}`,
      },
    },
    {
      loader: 'svgo-loader',
    },
  ],
}

module.exports = {
  FontsLoader,
  JSLoader,
  SCSSLoader,
  SVGLoader,
}
