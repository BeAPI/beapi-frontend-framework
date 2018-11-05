const fs = require('fs')
const ora = require('ora')

const CONF_IMG_DIR = './src/conf-img'
const IGNORED_TPL = 'default-picture.tpl'
const LOCATIONS_FILENAME = 'image-locations.json'
const SIZES_FILENAME = 'image-sizes.json'
const DEFAULT_PREFIX_NAME = 'default'
const DEFAULT_EXT = 'jpg'

const LOCATIONS = [{}]
const SIZES_STORE = []
const SIZES = [{}]

let nbLocations = 0
let nbSizes = 0

const cleanLocationName = name => name.split('.')[0]

const isRetina = src => {
  const retina = []
  src.split(',').forEach(val => {
    if (val.includes('2x')) {
      retina.push('2x')
    } else {
      retina.push('')
    }
  })
  return retina
}

const cleanDefaultName = size => `${size.replace('img', DEFAULT_PREFIX_NAME)}.${DEFAULT_EXT}`

const uniqueArray = a => a.filter((item, pos, self) => self.indexOf(item) === pos)

const createFile = (filename, json) => {
  fs.open(filename, 'r', (err, fd) => {
    if (err) {
      fs.writeFileSync(filename, json)
    } else {
      fs.writeFileSync(filename, json)
    }
  })
}

const imageLocationsFromTpl = () => {
  const templates = fs.readdirSync(`${CONF_IMG_DIR}/tpl/`).filter(tpl => tpl !== IGNORED_TPL)
  templates.forEach(tplName => {
    nbLocations += 1
    const tplContent = fs.readFileSync(`${CONF_IMG_DIR}/tpl/${tplName}`, 'utf8')
    const regex = /data-srcset="(.[^"]*)"/gm
    const srcsetArr = tplContent.match(regex)
    const locationName = cleanLocationName(tplName)
    LOCATIONS[0][locationName] = [
      {
        srcsets: [],
        default_img: '',
        img_base: '',
      },
    ]
    srcsetArr.forEach(src => {
      const regex = /img-\d*-\d*/gm
      const sizes = src.match(regex)
      const retina = isRetina(src)
      sizes.forEach((size, index) => {
        const srcsetObj = {
          srcset: retina[index],
          size,
        }
        SIZES_STORE.push(size)
        LOCATIONS[0][locationName][0].srcsets.push(srcsetObj)
        const defaultName = cleanDefaultName(size)
        LOCATIONS[0][locationName][0].default_img = defaultName
        LOCATIONS[0][locationName][0].img_base = size
      })
    })
  })
}

const cleanImageSizes = () => {
  uniqueArray(SIZES_STORE).forEach(size => {
    nbSizes += 1
    const splitSize = size.split('-')
    SIZES[0][size] = {
      width: splitSize[1],
      height: splitSize[2],
      crop: true,
    }
  })
}

const writeLocationsJSON = () => {
  createFile(`${CONF_IMG_DIR}/${LOCATIONS_FILENAME}`, JSON.stringify(LOCATIONS, null, 2))
}

const writeSizesJSON = () => {
  createFile(`${CONF_IMG_DIR}/${SIZES_FILENAME}`, JSON.stringify(SIZES, null, 2))
}

const init = async () => {
  const spinner = ora('Generate image locations and sizes JSON files').start()
  await imageLocationsFromTpl()
  await cleanImageSizes()
  await writeLocationsJSON()
  await writeSizesJSON()
  spinner.succeed(
    `JSON files successfully generated !\nNumber of locations : ${nbLocations} \nNumber of sizes : ${nbSizes}`
  )
}

init()
