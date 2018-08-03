const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const imagesSizes = require('./../tasks/image-sizes')
const flatten = array => [].concat(...array)
const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file).split('templates/')[1])
  })
  return filelist
}

module.exports = function(templateDir, folders) {
  const imagesDatas = imagesSizes()
  let templateFiles = []

  folders.map(folder => {
    const dir = path.resolve(__dirname, templateDir + folder)

    templateFiles.push(walkSync(dir))
  })

  return flatten(templateFiles)
    .filter(templateFile => templateFile.split('.')[1] === 'pug')
    .map(templateFile => {
      console.log('\x1b[32m', '🤘 Fetch ' + templateFile)
      const parts = templateFile.split('.')
      const name = parts[0]
      const extension = parts[1]
      const filename = name.includes('pages/') ? name.replace('pages/', '') : name

      return new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        inject: false,
        filename: `../${filename}.html`,
        template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        imagesDatas,
      })
    })
}
