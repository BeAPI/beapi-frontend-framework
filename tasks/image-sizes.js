const fs = require('fs')
const ora = require('ora')
const Json2csvParser = require('json2csv').Parser
const fields = ['location', 'sizes.width', 'sizes.height', 'sizes.retina', 'sizes.ratio']

const CONF_IMG_DIR = './src/conf-img'
const IGNORED_TPL = 'default-picture.tpl'
const LOCATIONS_FILENAME = 'image-locations.json'
const SIZES_FILENAME = 'image-sizes.json'
const DEFAULT_PREFIX_NAME = 'default'
const DEFAULT_EXT = 'jpg'
const CSV_ZIP_PATH = `${CONF_IMG_DIR}/images-sizes.csv`

const LOCATIONS = [{}]
const SIZES_STORE = []
const SIZES = [{}]

const isExport = process.argv[2] === 'csv'
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

const exportCSV = () => {
  const CSVInfo = []
  for (const location in LOCATIONS[0]) {
    const CSVObj = {
      location,
      sizes: [],
    }
    CSVInfo.push(CSVObj)
    const srcsets = LOCATIONS[0][location][0].srcsets
    srcsets.forEach(val => {
      const size = {}
      size.retina = val.srcset === '2x' ? '✓' : '×'
      const splitSize = val.size.split('-')
      size.width = splitSize[1]
      size.height = splitSize[2]
      size.ratio = size.width / size.height
      CSVObj.sizes.push(size)
    })
  }
  const json2csvParser = new Json2csvParser({ fields, unwind: 'sizes' })
  const csv = json2csvParser.parse(CSVInfo)
  createFile(CSV_ZIP_PATH, csv)
}

const init = async () => {
  const spinner = ora('Generate image locations and sizes JSON files').start()
  await imageLocationsFromTpl()
  await cleanImageSizes()
  await writeLocationsJSON()
  await writeSizesJSON()
  if (isExport) {
    await exportCSV()
    spinner.succeed(
      `JSON files successfully generated !\nNumber of locations : ${nbLocations} \nNumber of sizes : ${nbSizes} \nCSV exported`
    )
    return
  }
  spinner.succeed(
    `JSON files successfully generated !\nNumber of locations : ${nbLocations} \nNumber of sizes : ${nbSizes}`
  )
}

init()
