// https://github.com/evilebottnawi/favicons/

const favicons = require('favicons')
const fs = require('fs')
const mkdirp = require('mkdirp')
const source = 'assets/img/favicons/favicon_src.png'
let configuration = {
  appName: 'BFF',
  appDescription: 'BFF starter theme',
  developerName: 'Be API',
  developerURL: 'http://beapi.fr',
  background: '#ffffff',
  path: './dist/assets/img/favicons',
  url: 'http://beapi.fr',
  display: 'standalone',
  orientation: 'portrait',
  version: 1.0,
  logging: false,
  online: false,
  pipeHTML: true,
  replace: true
}

if (process.argv.indexOf('--appicon') === -1) {
  configuration = {
    ...configuration,
    html: 'index_sd.html',
    icons: {
      android: false,
      appleIcon: false,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      opengraph: false,
      windows: false,
      yandex: false
    }
  }
} else {
  configuration = {
    ...configuration,
    html: 'index_hd.html',
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: true,
      favicons: false,
      firefox: true,
      opengraph: false,
      windows: true,
      yandex: true
    }
  }
}
console.log('\x1b[36m%s\x1b[0m', '🤞 Favicons are being generated...')

const callback = function (error, response) {
  if (error) {
    console.log(error.status) // HTTP error code (e.g. `200`) or `null`
    console.log(error.name) // Error name e.g. 'API Error'
    console.log(error.message) // Error description e.g. 'An unknown error has occurred'
    return
  }

  if (response.images) {
    mkdirp.sync(configuration.path)
    response.images.forEach((image) => {
      console.log('\x1b[32m', `🤘 ${image.name} has been successfully generated into ${configuration.path}`)
      return fs.writeFileSync(`${configuration.path}/${image.name}`, image.contents)
    })
  }

  if (response.files) {
    mkdirp.sync(configuration.path)
    response.files.forEach((file) => {
      console.log('\x1b[32m', `🤘 ${file.name} has been successfully generated into ${configuration.path}`)
      return fs.writeFileSync(`${configuration.path}/${file.name}`, file.contents)
    })
  }

  if (response.html) {
    console.log('\x1b[32m', `🤘 ${configuration.html} has been successfully generated to ${configuration.path}`)
    fs.writeFileSync(`${configuration.path}/${configuration.html}`, response.html.join('\n'))
  }
}

favicons(source, configuration, callback)
