const path = require('path')

module.exports = {
  entry: {
    app: [
      './assets/css/style.scss',
      './assets/js/app.js'
    ]
  },
  assets_path: path.resolve(__dirname, './../html/assets'),
  assets_public_path: '/assets/',
  port: 9090,
  refresh: [
    '**/*.php',
    'html/assets/*.css',
    'html/assets/*.js'
  ]
}
