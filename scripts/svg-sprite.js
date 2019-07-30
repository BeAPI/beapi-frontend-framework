const fs = require('fs')
const path = require('path')
const svgstore = require('svgstore')
const SVGO = require('svgo')
const ora = require('ora')
const cheerio = require('cheerio')

const svgoPlugins = [
  { cleanupAttrs: true },
  { removeDoctype: true },
  { removeXMLProcInst: true },
  { removeComments: true },
  { removeMetadata: true },
  { removeTitle: true },
  { removeDesc: true },
  { removeUselessDefs: true },
  { removeEditorsNSData: true },
  { removeEmptyAttrs: true },
  { removeHiddenElems: true },
  { removeEmptyText: true },
  { removeEmptyContainers: true },
  { cleanupEnableBackground: true },
  { convertStyleToAttrs: true },
  { convertColors: true },
  { convertPathData: true },
  { convertTransform: true },
  { removeUnknownsAndDefaults: true },
  { removeNonInheritableGroupAttrs: true },
  { removeUselessStrokeAndFill: true },
  { removeUnusedNS: true },
  { cleanupIDs: true },
  { cleanupNumericValues: true },
  { moveElemsAttrsToGroup: true },
  { moveGroupAttrsToElems: true },
  { collapseGroups: true },
  { removeRasterImages: false },
  { mergePaths: true },
  { convertShapeToPath: true },
  { sortAttrs: true },
  { removeDimensions: false },
  { prefixIds: true },
  { removeViewBox: false },
]
const icons = [
  {
    id: 'Icons front',
    src: './src/img/icons',
    dist: './dist/assets/img/icons',
    filename: 'icons.svg',
    prefix: 'icon',
    optimize: true,
  },
]

const createDir = async dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const optimizeIcons = async (src, optimize) => {
  if (!optimize) {
    return false
  }

  const svgo = new SVGO({
    plugins: svgoPlugins,
  })
  fs.readdir(src, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      if (path.extname(file) === '.svg') {
        const filepath = `${src}/${file}`
        fs.readFile(filepath, 'utf8', (err, data) => {
          if (err) throw err
          svgo.optimize(data, { path: filepath }).then(result => {
            fs.writeFileSync(filepath, result.data)
          })
        })
      }
    })
  })
}

const generateSprite = async (src, dist, name, prefix) => {
  const sprites = svgstore()
  fs.readdir(src, (err, files) => {
    if (err) throw err
    files.forEach(file => {
      if (path.extname(file) === '.svg') {
        const filename = file.split('.')[0]
        sprites.add(`${prefix}-${filename}`, fs.readFileSync(`${src}/${file}`, 'utf8'))
      }
    })
    const $ = cheerio.load(sprites.toString({ inline: true }))
    const svg = $('svg').addClass('svg-sprite')
    fs.writeFileSync(`${dist}/${name}`, svg)
  })
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const init = async () => {
  asyncForEach(icons, async icon => {
    const spinner = ora(`Generation SVG sprite for ${icon.id}`).start()
    await createDir(icon.dist)
    await optimizeIcons(icon.src, icon.optimize)
    await generateSprite(icon.src, icon.dist, icon.filename, icon.prefix)
    spinner.succeed(`Sprite for ${icon.id} has been generated in ${`${icon.dist}/${icon.filename}`}`)
  })
}

init()
