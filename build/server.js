const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const config = require('./config')

module.exports = new BrowserSyncPlugin(
  {
    proxy: 'http://[::1]:' + config.port,
    files: [
      {
        match: config.refresh,
        fn: function (event, file) {
          if (event === 'change') {
            const bs = require('browser-sync').get('bs-webpack-plugin')
            bs.reload()
          }
        }
      }
    ],
    startPath: '/html/index.php',
    notify: false
  },
  {
    reload: false
  }
)
