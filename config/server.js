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
          fn: function(event, file) {
            if (event === 'change') {
              const bs = require('browser-sync').get('bs-webpack-plugin')
              if (file.indexOf('.css') >= 0) {
                bs.reload('*.css')
              } else {
                bs.reload()
              }
            }
          },
        },
      ],
      startPath: '/dist/index.php',
      notify: true,
    },
    {
      reload: false,
      injectCss: true,
    }
  )
)

module.exports = webpackDev

