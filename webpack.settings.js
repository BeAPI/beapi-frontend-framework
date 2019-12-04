const path = require('path')

module.exports = {
  entry: {
    app: ['./src/js/app.js', './src/scss/style.scss'],
    'editor-style': './src/scss/editor-style.scss',
  },
  assetsPath: path.resolve(__dirname, 'dist/assets'),
  dev: process.env.NODE_ENV === 'dev',
  refresh: [
    'dist/**/*.php',
    'dist/assets/app.css',
    'dist/assets/*.js',
    'dist/assets/img/icons/',
    'dist/assets/img/icons/*.svg',
  ],
}
