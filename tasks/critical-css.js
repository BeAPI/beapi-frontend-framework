const penthouse = require('penthouse')
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

// Define your env.
var _configCritical = JSON.parse(fs.readFileSync('assets/css/critical/conf/bea-critical-conf.json', 'utf8'))
var _css = JSON.parse(fs.readFileSync('dist/assets/assets.json', 'utf8'))
var _envUrl = _configCritical.envUrl

function funcPenthouse (_width, _height, _viewport, _url, _page) {
  penthouse({
    url: _url,
    css: path.join('dist/assets/' + _css['app.css']),
    width: _width, // viewport width
    height: _height, // viewport height
    timeout: 30000, // ms; abort critical css generation after this timeout
    strict: false, // set to true to throw on css errors (will run faster if no errors)
    maxEmbeddedBase64Length: 1000, // charaters; strip out inline base64 encoded resources larger than this
    userAgent: 'Penthouse Critical Path CSS Generator' // specify which user agent string when loading the page
    /* phantomJsOptions: { // see `phantomjs --help` for the list of all available options
      'proxy': 'http://proxy.company.com:8080',
      'ssl-protocol': 'SSLv3'
    } */
  })
    .then(criticalCss => {
      shell.mkdir('-p', path.resolve('dist/assets/css/critical/'))

      fs.writeFileSync(__dirname + '/../dist/assets/css/critical/' + _page + '-' + _viewport + '.css', criticalCss)
      console.log('\x1b[32m', 'Critical CSS successfully generated for [[ page ' + _page + ' ]]   [[ ' + _viewport + ' viewport ]]   [[ ' + _url + ' ]]')
    })
    .catch(err => {
      console.log(err)
    })
}

// Test generate critical css
console.log('\x1b[36m%s\x1b[0m', 'Critical CSS are being generated...')

_configCritical.pages.forEach(function (page) {
  page.url = _envUrl + page.url
  _configCritical.viewports.forEach(function (viewport) {
    funcPenthouse(viewport.width, viewport.height, viewport.name, page.url, page.name)
  })
})
