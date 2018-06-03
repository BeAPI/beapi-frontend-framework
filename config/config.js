const path = require('path')

module.exports = {
  entry: {
    app: ['./src/css/style.scss', './src/js/app.js'],
  },
  assetsPath: path.resolve('./dist/assets'),
  assetsPublicPath: 'assets/',
  port: 9090,
  dev: process.env.NODE_ENV === 'dev',
  devServer: {
    contentBase: path.resolve('./dist/'),
    overlay: true,
  },
}
