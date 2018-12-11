const path = require('path')

module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/js/app.js', './src/css/style.scss'],
    'editor-style': './src/css/editor-style.scss',
  },
  assets_path: path.resolve(__dirname, './../dist/assets'),
  assets_public_path: '/src/',
  port: 9090,
  dev: process.env.NODE_ENV === 'dev',
  refresh: [
    'dist/**/*.php',
    'dist/assets/app.css',
    'dist/assets/*.js',
    'dist/assets/img/icons/',
    'dist/assets/img/icons/*.svg',
  ],
}