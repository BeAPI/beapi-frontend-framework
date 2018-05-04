const svgstore = require('svgstore')
const fs = require('fs')
const path = require('path')
const SVGO = require('svgo')

const srcIcons = './src/img/icons'
const distSvg = './dist/icons/icons.svg'
const prefix = 'icon'
const sprites = svgstore({
  copyAttrs: true,
  inline: true
})
const svgo = new SVGO()

module.exports = () => {
  fs.readdir(srcIcons, (err, files) => {
    files.forEach(file => {
      if (path.extname(file) === '.svg') {
        const filename = file.split('.')[0]
        // console.log(fs.readFileSync(`${srcIcons}/${file}`, 'utf8'))
        sprites.add(`${prefix}-${filename}`, fs.readFileSync(`${srcIcons}/${file}`, 'utf8'))
      }
    })

    fs.writeFileSync(distSvg, sprites)
  })
}
