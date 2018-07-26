const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const config = require('./config')
const webpackDev = require('./webpack.dev')

webpackDev.plugins.push(
  new BrowserSyncPlugin(
    {
      port: 3001,
      proxy: 'http://localhost:' + config.devServer.port + '/',
    },
    {
      reload: false,
    }
  )
)

module.exports = webpackDev
