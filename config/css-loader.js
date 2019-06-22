const config = require('./config')
module.exports = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      url: false,
      sourceMap: config.dev,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: loader => [require('autoprefixer')()],
    },
  },
]
