const fs = require('fs')
const yaml = require('js-yaml')
const portfinder = require('portfinder')

let landoProjectName = 'sample'

try {
  if (fs.existsSync('../../../../.lando.yml')) {
    let fileContents = fs.readFileSync('../../../../.lando.yml', 'utf8')
    let data = yaml.load(fileContents)

    if (data.name) {
      landoProjectName = data.name
    }
  }
} catch (e) {
  console.log(e)
}

// BrowserSync options
const browserSyncOptions = {
  port: 3000,
  proxy: `https://${landoProjectName}.lndo.site/`,
  https: true,
  injectChanges: true,
  files: ['*.php', '**/*.php', 'dist/*.css', 'dist/*.js', 'dist/img/icons/*.svg'],
  startPath: '/',
  notify: true,
}

// Plugin options
const pluginOptions = {
  injectCss: true,
}

portfinder.getPort(
  {
    port: 3000, // default port
    stopPort: 3333, // maximum port
  },
  function (port) {
    browserSyncOptions.port = port
  }
)

module.exports = {
  browserSyncOptions,
  pluginOptions,
}
