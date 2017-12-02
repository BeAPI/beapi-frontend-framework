module.exports = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      url: false
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: (loader) => [
        require('autoprefixer')()
      ]
    }
  }
]
