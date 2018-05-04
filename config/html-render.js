const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))

  return templateFiles.filter(templateFile => templateFile.split('.')[1] === 'pug').map(templateFile => {
    console.log(templateFile)
    const parts = templateFile.split('.')
    const name = parts[0]
    const extension = parts[1]

    return new HtmlWebpackPlugin({
      filename: `../${name}.html`,
      template: '!!pug-loader?pretty=true!' + path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: {
        collapseWhitespace: false,
      },
    })
  })
}
