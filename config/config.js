const path = require('path')

module.exports = {
  entry: {
    app: ['./src/css/style.scss', './src/js/app.js'],
  },
<<<<<<< HEAD
  assets_path: path.resolve(__dirname, './../dist/assets'),
  assets_public_path: '/src/',
  port: 9090,
||||||| parent of 6213aa1... some fixes
  assetsPath: path.resolve('./dist/assets'),
  assetsPublicPath: 'assets/',
  port: 9090,
=======
  assetsPath: path.resolve('./dist/assets'),
  assetsPublicPath: 'assets/',
>>>>>>> 6213aa1... some fixes
  dev: process.env.NODE_ENV === 'dev',
<<<<<<< HEAD
  refresh: [
    'dist/**/*.php',
    'src/**/*.scss',
    'dist/assets/*.js',
    'dist/assets/img/icons/',
    'dist/assets/img/icons/*.svg',
  ],
||||||| parent of 6213aa1... some fixes
  devServer: {
    contentBase: path.resolve('./dist/'),
    overlay: true,
  },
=======
  devServer: {
    contentBase: path.resolve('./dist/'),
    overlay: true,
    port: 8080,
  },
>>>>>>> 6213aa1... some fixes
}
