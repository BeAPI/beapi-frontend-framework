const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const webpackDev = require('./webpack.dev')
const config = require('./config')

webpackDev.plugins.push(
  new BrowserSyncPlugin(
    {
      proxy: 'http://[::1]:' + config.port,
      files: [
        {
          match: config.refresh,
          fn: function (event, file) {
            if (event === 'change') {
              const bs = require('browser-sync').get('bs-webpack-plugin')
              bs.reload({stream: true})
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
)

module.exports = webpackDev
