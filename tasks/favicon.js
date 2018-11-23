// https://github.com/evilebottnawi/favicons/

const favicons = require('favicons')
const fs = require('fs')
const mkdirp = require('mkdirp')
const faviconPath = 'src/img/favicons/'
const faviconSource = faviconPath + 'favicon_src.png'
const appiconSource = faviconPath + 'appicon_src.png'
const distPath = './dist/assets/img/favicons'
const appicon = process.argv.indexOf('--appicon') === -1

let configuration = {
  appName: 'BFF',
  appDescription: 'BFF starter theme',
  developerName: 'Be API',
  developerURL: 'http://beapi.fr',
  background: '#ffffff',
  path: './',
  url: 'http://beapi.fr',
  display: 'standalone',
  orientation: 'portrait',
  version: 1.0,
  logging: false,
  online: false,
  pipeHTML: true,
  replace: true,
}

if (appicon) {
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
      yandex: false,
    },
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
      yandex: true,
    },
  }
}
console.log('\x1b[36m%s\x1b[0m', '🤞 Generating favicons...')

const callback = function(error, response) {
  if (error) {
    console.log(error.status) // HTTP error code (e.g. `200`) or `null`
    console.log(error.name) // Error name e.g. 'API Error'
    console.log(error.message) // Error description e.g. 'An unknown error has occurred'
    return
  }

  if (response.images) {
    mkdirp.sync(distPath)
    response.images.forEach(image => {
      console.log('\x1b[32m', `🤘 ${image.name} has been successfully generated into ${distPath}`)
      return fs.writeFileSync(`${distPath}/${image.name}`, image.contents)
    })
  }

  if (response.files) {
    mkdirp.sync(distPath)
    response.files.forEach(file => {
      console.log('\x1b[32m', `🤘 ${file.name} has been successfully generated into ${distPath}`)
      return fs.writeFileSync(`${distPath}/${file.name}`, file.contents)
    })
  }

  if (response.html) {
    console.log('\x1b[32m', `🤘 ${configuration.html} has been successfully generated to ${distPath}`)
    fs.writeFileSync(`${distPath}/${configuration.html}`, response.html.join('\n'))
  }
}

favicons(appicon ? faviconSource : appiconSource, configuration, callback)
