const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const config = require('./config')
const webpackDev = require('./webpack.dev')
<<<<<<< HEAD:config/server.js
const config = require('./config')
||||||| parent of 6213aa1... some fixes
const svgSprite = require('./../tasks/svg-sprite')
=======
>>>>>>> 6213aa1... some fixes:config/browser-sync.js

webpackDev.plugins.push(
  new BrowserSyncPlugin(
    {
<<<<<<< HEAD:config/server.js
      proxy: 'http://[::1]:' + config.port,
      watchOptions: {
        ignoreInitial: true,
        ignored: '*.txt',
      },
      files: [
        {
          match: config.refresh,
          fn: function(event, file) {
            if (event === 'change') {
              const bs = require('browser-sync').get('bs-webpack-plugin')
              bs.stream({ once: true })

              if (file.indexOf('.scss') >= 0) {
                setTimeout(function() {
                  bs.reload()
                }, 3000)
              } else {
                bs.reload()
              }
            }
          },
        },
      ],
      startPath: '/dist/index.php',
      notify: false,
||||||| parent of 6213aa1... some fixes
      host: '0.0.0.0',
      port: 3001,
      proxy: 'http://localhost:8080/',
      files: [
        {
          match: ['src/**/*.svg', 'src/**/*.pug'],
          fn: function(event, file) {
            if (event === 'change') {
              if (file.includes('.svg')) {
                svgSprite()
              }
              const bs = require('browser-sync').get('bs-webpack-plugin')
              setTimeout(() => {
                bs.reload()
              }, 3000)
            }
          },
        },
      ],
=======
      port: 3001,
      proxy: 'http://localhost:' + config.devServer.port + '/',
>>>>>>> 6213aa1... some fixes:config/browser-sync.js
    },
    {
      reload: false,
    }
  )
)

module.exports = webpackDev
