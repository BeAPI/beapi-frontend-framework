const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const imagesSizes = require('./image-sizes')
const flatten = array => [].concat(...array)

module.exports = function(templateDir, folders) {
  const imagesDatas = imagesSizes()
  let templateFiles = []

  folders.map(folder => {
    let files = fs.readdirSync(path.resolve(__dirname, templateDir + folder))

    files = files.map(file => folder + '/' + file)

    templateFiles.push(files)
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
        inject: true,
        filename: `../${filename}.html`,
        template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        imagesDatas,
      })
    })
}
