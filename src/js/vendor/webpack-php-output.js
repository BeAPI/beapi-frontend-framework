// TODO: remove lodash and other dependencies
var _ = require('lodash')
var path = require('path')
var url = require('url')
var fs = require('fs')

function PhpOutputPlugin(options) {
  var defaults = {
    outPutPath: false, // false for default webpack path of pass string to specify
    assetsPathPrefix: '',
    phpClassName: 'WebpackBuiltFiles', //
    phpFileName: 'WebpackBuiltFiles',
    nameSpace: false, // false {nameSpace: 'name', use: ['string'] or empty property or don't pass "use" property}
    path: '',
    extraPurePatches: [],
  }

  this.options = _.defaults(options, defaults)
}

PhpOutputPlugin.prototype.apply = function apply(compiler) {
  var options = this.options

  var getCssFiles = function(filelist, filepath) {
    return _.map(
      _.filter(filelist, filename => filename.endsWith('.css') && !filename.startsWith('editor-style')), // filtering
      filename => path.join(options.assetsPathPrefix, filepath, filename) // mapping filtered
    )
  }

  var getJsFiles = function(filelist, filepath) {
    let files = _.map(
      _.filter(filelist, filename => filename.endsWith('.js') && !filename.startsWith('editor-style')), // filtering
      filename => path.join(options.assetsPathPrefix, filepath, filename) // mapping filtered
    )

    if (options.extraPurePatches.length) {
      files = files.concat(options.extraPurePatches)
    }

    // return files.sort().reverse()
    return files
  }

  var arrayToPhpStatic = function(list, varname) {
    var out = '  static $' + varname + ' = [\n'
    _.forEach(list, function(item) {
      out += "    '" + item + "',"
    })
    out += '\n  ];\n'
    return out
  }

  var objectToPhpClass = function(obj) {
    // Create a header string for the generated file:
    var out = '<?php\n\n'

    if (options.nameSpace) {
      let nameSpaceVal = _.isString(options.nameSpace) ? options.nameSpace : options.nameSpace.nameSpace
      out += 'namespace ' + nameSpaceVal + '; \n\n'
      if (options.nameSpace.use && options.nameSpace.use.length) {
        _.forEach(options.nameSpace.use, use => {
          out += 'use ' + use + ';\n'
        })
      }
    }
    out += 'class ' + options.phpClassName + ' {\n'

    _.forEach(obj, (list, name) => {
      out += arrayToPhpStatic(list, name)
    })

    out += '\n}\n'
    return out
  }

  var mkOutputDir = function(dir) {
    // Make webpack output directory if it doesn't already exist
    try {
      fs.mkdirSync(dir)
    } catch (err) {
      // If it does exist, don't worry unless there's another error
      if (err.code !== 'EEXIST') throw err
    }
  }

  compiler.plugin('emit', function(compilation, callback) {
    var stats = compilation.getStats().toJson()
    var toInclude = []

    // Flatten the chunks (lists of files) to one list
    for (var chunkName in stats.assetsByChunkName) {
      var asset = stats.assetsByChunkName[chunkName]

      if (typeof asset === 'string') {
        toInclude.push(asset)
      } else if (Array.isArray(asset)) {
        toInclude = _.union(toInclude, asset)
      }
    }

    var out = objectToPhpClass({
      jsFiles: getJsFiles(toInclude, options.path),
      cssFiles: getCssFiles(toInclude, options.path),
    })

    // Write file using fs
    // Build directory if it doesn't exist
    var outPutPath = options.outPutPath ? options.outPutPath : compiler.options.output.path

    mkOutputDir(path.resolve(outPutPath))
    fs.writeFileSync(path.join(outPutPath, options.phpFileName + '.php'), out)

    callback()
  })
}

module.exports = PhpOutputPlugin
