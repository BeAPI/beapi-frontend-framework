const fs = require('fs')
const path = require('path')

module.exports = () => {
  const dirToFetch = ['pages', 'partials']
  const dir = path.resolve(__dirname, './../src/templates/partials')

  fs.readdirSync(dir).forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      dirToFetch.push(path.join(dir, file).split('templates/')[1])
    }
  })

  console.log(dirToFetch)
  return dirToFetch
}
