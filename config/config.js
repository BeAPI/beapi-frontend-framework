const path = require('path')

module.exports = {
  entry: {
    app: [
      './assets/css/style.scss',
      './assets/js/app.js'
    ]
  },
  assets_path: path.resolve(__dirname, './../dist/assets'),
  assets_public_path: '/assets/',
  port: 9090,
  dev: process.env.NODE_ENV === 'dev',
  refresh: [
    '**/*.php',
    'assets/**/*.scss',
    'dist/assets/*.js',
    'assets/img/icons/',
    'assets/img/icons/*.svg'
  ]
}
