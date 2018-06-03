const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const webpackDev = require('./webpack.dev')

webpackDev.plugins.push(
  new BrowserSyncPlugin(
    {
      host: '0.0.0.0',
      port: 3001,
      proxy: 'http://localhost:8080/',
      files: [
        {
          match: ['src/**/*.pug'],
          fn: function(event, file) {
            if (event === 'change') {
              const bs = require('browser-sync').get('bs-webpack-plugin')
              setTimeout(() => {
                bs.reload()
              }, 3000)
            }
          },
        },
      ],
    },
    {
      reload: false,
    }
  )
)

module.exports = webpackDev
