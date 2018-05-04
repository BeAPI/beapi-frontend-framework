const path = require('path')

module.exports = {
  entry: {
    app: ['./src/css/style.scss', './src/js/app.js'],
  },
  assets_path: path.resolve(__dirname, './../dist/assets'),
  assets_public_path: '/src/',
  port: 9090,
  dev: process.env.NODE_ENV === 'dev',
  refresh: [
    'dist/**/*.php',
    'dist/**/*.html',
    'src/**/*.scss',
    'dist/assets/*.js',
    'src/img/icons/',
    'src/img/icons/*.svg',
  ],
}
