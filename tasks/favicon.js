const favicons = require('favicons')
const fs = require('fs')
const mkdirp = require('mkdirp')
const source = 'assets/img/favicons/favicon_src.png'
const configuration = {
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
  html: 'index_hd.html',
  pipeHTML: true,
  replace: true,
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

const callback = function (error, response) {
  if (error) {
    console.log(error.status) // HTTP error code (e.g. `200`) or `null`
    console.log(error.name) // Error name e.g. 'API Error'
    console.log(error.message) // Error description e.g. 'An unknown error has occurred'
    return
  }
  console.log(response.images) // Array of { name: string, contents: <buffer> }
  console.log(response.files) // Array of { name: string, contents: <string> }
  console.log(response.html) // Array of strings (html elements)

  if (response.images) {
    mkdirp.sync(configuration.path)
    response.images.forEach((image) =>
      fs.writeFileSync(`${configuration.path}/${image.name}`, image.contents))
  }

  if (response.files) {
    mkdirp.sync(configuration.path)
    response.files.forEach((file) =>
      fs.writeFileSync(`${configuration.path}/${file.name}`, file.contents))
  }

  if (response.html) {
    fs.writeFileSync(`${configuration.path}/test.html`, response.html.join('\n'))
  }
}

favicons(source, configuration, callback)
