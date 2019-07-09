const path = require('path')

module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/js/app.js', './src/scss/style.scss'],
    'editor-style': './src/scss/editor-style.scss',
  },
  assetsPath: path.resolve(__dirname, 'dist/assets'),
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
