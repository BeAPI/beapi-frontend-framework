const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const webpackDev = require('./webpack.dev')
const config = require('./config')

webpackDev.plugins.push(
  new BrowserSyncPlugin(
    {
      proxy: 'http://[::1]:' + config.port,
      watchOptions: {
        ignoreInitial: true,
        ignored: '*.txt'
      },
      files: [
        {
          match: config.refresh,
          fn: function (event, file) {
            if (event === 'change') {
              const bs = require('browser-sync').get('bs-webpack-plugin')
              bs.stream({once: true})

              if (file.indexOf('.scss') >= 0) {
                setTimeout(function () {
                  bs.reload()
                }, 3000)
              } else {
                bs.reload()
              }
            }
          }
        }
      ],
      startPath: '/dist/index.php',
      notify: false
    },
    {
      reload: false
    }
  )
)

module.exports = webpackDev
