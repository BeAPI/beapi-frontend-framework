const axios = require('axios')
const inquirer = require('inquirer')
const fuzzy = require('fuzzy')
const Promise = require('promise')
const download = require('download-file')
const reqUrl = {
  'scss': 'https://api.github.com/repos/BeAPI/bff-components/contents/scss',
  'js': 'https://api.github.com/repos/BeAPI/bff-components/contents/js'
}
let files = []
let fileOpts = {}

console.log('Hi, welcome to composerjs')

// Init autocomplete prompt type
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

inquirer.prompt({
  type: 'list',
  name: 'req',
  message: 'What kind of snippet do you need?',
  choices: ['scss', 'js']
}).then(data => {
  fileOpts.ext = data.req
  axios.get(reqUrl[data.req]).then(res => {
    files = res.data.map(file => file.name)
    inquirer.prompt({
      type: 'autocomplete',
      name: 'file',
      message: 'Which file you need to download ?',
      source: searchFiles
    }).then(data => {
      fileOpts.name = data.file
      let dirPath = setDirPath(fileOpts.ext)
      axios.get(reqUrl[fileOpts.ext]).then(res => {
        let remoteFile = res.data.find(f => f.name === fileOpts.name)
        fileOpts.downloadUrl = remoteFile.download_url
        inquirer.prompt({
          type: 'list',
          name: 'path',
          message: 'Where should I put the downloaded file ?',
          choices: dirPath
        }).then(data => {
          fileOpts.path = data.path
          let downloadOpts = {
            directory: fileOpts.path,
            filename: fileOpts.name
          }
          download(fileOpts.downloadUrl, downloadOpts, err => {
            if (err) {
              throw err
            }
            console.log('\n\nYour snippet was download successfully 😃\n')
            printImportToConsole()
            console.log('\n')
          })
        })
      })
    })
  }).catch(error => {
    console.log(error)
  })
})

/**
 * FuzzySort to search file in prompt
 * @param {array} answers
 * @param {*} input
 */
function searchFiles (answers, input) {
  input = input || ''
  return new Promise(resolve => {
    setTimeout(() => {
      let fuzzyResult = fuzzy.filter(input, files)
      resolve(fuzzyResult.map(el => {
        return el.original
      }))
    }, 100)
  })
}

/**
 * Prompt default path dir from BFF theme
 * @param {string} ext
 * @return {array}
 */
function setDirPath (ext) {
  if (ext === 'scss') {
    return ['../assets/css/patterns/', '../assets/css/components/', '../assets/css/pages/', '../assets/css/root/']
  } else if (ext === 'js') {
    return ['../assets/js/src/', '../assets/js/vendor', '../assets/js/vendor_async']
  }
}

/**
 * Print import details to the console
 */
function printImportToConsole () {
  if (fileOpts.ext === 'scss') {
    let sassPath = formatSassPath()
    let sassFileName = formatSassFileName()
    console.log('You can now add this line in your style.scss')
    console.log(`@import "${sassPath}${sassFileName}"`)
  } else if (fileOpts.ext === 'js') {
    console.log('You can require your script where you need it')
  }
}

/**
 * Format sass path for default style.css file
 * @return {string}
 */
function formatSassPath () {
  let path = fileOpts.path
  path = path.split('/')
  return `${path[path.length - 2]}/`
}

/**
 * Remove _ and extension form sass file name
 * @return {string}
 */
function formatSassFileName () {
  let fileName = fileOpts.name
  if (fileName[0] === '_') {
    fileName = fileName.substr(1)
  }
  fileName = fileName.replace(/\.[^/.]+$/, '')
  return fileName
}