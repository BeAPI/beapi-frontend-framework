const path = require('path')

module.exports = {
  entry: {
    'babel-polyfill': ['babel-polyfill'],
    app: ['./src/css/style.scss', './src/js/app.js'],
  },
  assetsPath: path.resolve('./dist/assets'),
  assetsPublicPath: 'assets/',
  dev: process.env.NODE_ENV === 'dev',
  devServer: {
    contentBase: path.resolve('./dist/'),
    overlay: true,
    port: 8080,
  },
}
