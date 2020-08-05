const path = require('path')

module.exports = {
  entry: {
    app: ['./src/js/app.js', './src/scss/style.scss'],
    'editor-style': './src/scss/editor-style.scss',
  },
  path: {
    src: path.resolve(__dirname, './src'), // source files
    build: path.resolve(__dirname, './dist'), // production build files
    static: path.resolve(__dirname, './public'), // static files to copy to build folder
  },
  dev: process.env.NODE_ENV === 'dev',
  refresh: [
    'dist/**/*.php',
    'dist/assets/app.css',
    'dist/assets/*.js',
    'dist/assets/img/icons/',
    'dist/assets/img/icons/*.svg',
  ],
}
