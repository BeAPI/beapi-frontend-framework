const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const logId = '[' + chalk.blue('WebpackImageSizesPlugin') + ']'

class WebpackImageSizesPlugin {
  constructor(options) {
    // folders
    this._confImgFolder = path.resolve(__dirname, '../assets/conf-img') + '/'
    this._tplFolder = this._confImgFolder + 'tpl/'
    this._defaultImagesFolder = path.resolve(__dirname, '../dist/images') + '/'

    // files
    this._imageSisesJson = this._confImgFolder + 'image-sizes.json'
    this._imageLocationsJson = this._confImgFolder + 'image-locations.json'
    this._imageDefault = path.resolve(__dirname, '../src/img/static') + '/default.jpg'

    // list of [filnename]: sizes
    this._defaultImages = {}

    if (options.watch) {
      fs.watch(this._tplFolder, () => {
        this.generateImageJsonFiles()
        this.generateDefaultImages()
      })
    }

    this.generateImageJsonFiles()
  }

  /**
   * apply
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('WebpackImageSizesPlugin', (compilation, callback) => {
      this.generateDefaultImages()
      callback()
    })
  }

  /**
   * Generate image-sises.json and image-location.json
   */
  generateImageJsonFiles() {
    const that = this
    const regex = {
      srcset: /data-srcset="(.[^"]*)"/gm,
      crop: /crop="(.[^"]*)"/gm,
      img: /img-\d*-\d*/gm,
    }

    const locations = {}
    const sizes = {}

    let nbLocations = 0
    let nbSizes = 0

    /**
     * reset defaultImages
     */
    this._defaultImages = {}

    /**
     * Return an array of names of tpl files
     * @return {array}
     */
    function getTemplateFileNames() {
      return fs.readdirSync(that._tplFolder).filter((tpl) => {
        if (tpl !== 'default-picture.tpl' && tpl !== 'default-picture-caption.tpl') {
          return tpl
        }
      })
    }

    /**
     * Return content of tpl file
     * @param {string} templateFileName
     * @return {string}
     */
    function getTemplateFileContent(templateFileName) {
      return fs.readFileSync(that._tplFolder + templateFileName, 'utf8')
    }

    /**
     * Create a json file
     * @param {string} destPath
     * @param data
     * @return undefined
     */
    function createJsonFile(destPath, data) {
      createFile(destPath, JSON.stringify(data, null, 2))
    }

    /**
     * Remove extension template name
     * @param {string} name
     * @return {String}
     */
    function removeFileExtension(name) {
      return name.split('.')[0]
    }

    /**
     * Generate default location name based on image size
     * @param {String} size
     * @return {String}
     */
    function getDefaultImgName(str) {
      return `${str.replace('img', 'default')}.jpg`
    }

    /**
     * Check if srcset is retina
     * @param {String} src
     * @return {Array}
     */
    function isRetina(src) {
      const retina = []
      src.split(',').forEach((val) => {
        if (val.includes('2x')) {
          retina.push('2x')
        } else {
          retina.push('')
        }
      })
      return retina
    }

    /**
     * Create file if he does not exist
     * @param {String} filename
     * @param {String} json
     */
    function createFile(filename, json) {
      fs.open(filename, 'r', () => {
        fs.writeFileSync(filename, json)
      })
    }

    /**
     * Get image locations informations from tpl files
     */
    function imageLocationsFromTpl() {
      const templateFileNames = getTemplateFileNames()

      templateFileNames.forEach((tplName) => {
        nbLocations += 1
        const tplContent = getTemplateFileContent(tplName)
        const srcsetArr = tplContent.match(regex.srcset) || []
        const cropArr = tplContent.match(regex.crop)
        const storage = {
          srcsets: [],
          default_img: '',
          img_base: '',
        }

        srcsetArr.forEach((src) => {
          const dimensions = src.match(regex.img)
          const retina = isRetina(src)
          const crop = !(cropArr && cropArr[0] === 'crop="false"')

          dimensions.forEach((size, index) => {
            const splitSize = size.split('-')
            const srcsetObj = {
              srcset: retina[index],
              size,
            }

            if (sizes[size] && sizes[size].crop !== crop) {
              console.log(logId, '\nSize already exists but crop is not equal :', size)
            }

            if (!sizes[size]) {
              sizes[size] = {
                width: splitSize[1],
                height: splitSize[2],
                crop,
              }

              nbSizes += 1
            }

            storage.srcsets.push(srcsetObj)
            storage.default_img = getDefaultImgName(size)
            storage.img_base = size

            that._defaultImages[getDefaultImgName(size)] = sizes[size]
          })

          locations[removeFileExtension(tplName)] = [storage]
        })
      })
    }

    /**
     * Init
     */
    console.log(logId, 'Generate image locations and sizes JSON files')

    imageLocationsFromTpl()

    createJsonFile(this._imageLocationsJson, [locations])
    createJsonFile(this._imageSisesJson, [sizes])

    console.log(logId, 'JSON files successfully generated !')
    console.log(logId, 'Number of locations:', nbLocations)
    console.log(logId, 'Number of sizes:', nbSizes)

    return this
  }

  /**
   * generate default images
   */
  generateDefaultImages() {
    if (!fs.existsSync(this._defaultImagesFolder)) {
      fs.mkdirSync(this._defaultImagesFolder, { recursive: true })
    }

    for (const filename in this._defaultImages) {
      const sizes = this._defaultImages[filename]
      const outputFile = this._defaultImagesFolder + filename

      try {
        if (fs.existsSync(outputFile)) {
          continue
        }

        const width = parseInt(sizes.width, 10)
        const height = parseInt(sizes.height, 10)

        if (width >= 9999 || height >= 9999) {
          continue
        }

        sharp(this._imageDefault)
          .resize(width, height, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg({ quality: 70, chromaSubsampling: '4:4:4' })
          .toFile(outputFile, (err, info) => {
            if (err) {
              console.error(logId, err)
            } else {
              console.log(logId, `Created ${info.width}x${info.height} image`)
              console.log(logId, 'at', outputFile.split('/themes/')[1] || '')
            }
          })
      } catch (err) {
        console.error(logId, err)
      }
    }

    return this
  }
}

module.exports = WebpackImageSizesPlugin
