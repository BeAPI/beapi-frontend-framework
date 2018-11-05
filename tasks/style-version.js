const fs = require('fs')

const updateStyle = (content, type) => {
  const regex = /[V|v]ersion: ([\d(\.)?]{0,})/g

  const nextVersion = content.replace(regex, (match, gr1) => {
    let typeArr = gr1.split('.')
    typeArr = parseIntArr(typeArr)
    if (typeArr.length === 2) {
      typeArr.push(0)
    }

    if (type === 'patch') {
      typeArr = patchUpdate(typeArr)
    } else if (type === 'minor') {
      typeArr = minorUpdate(typeArr)
    } else if (type === 'major') {
      typeArr = majorUpdate(typeArr)
    }

    console.log('\x1b[33m%s\x1b[0m\x1b[40m', 'style.css version updated to : ' + typeArr.join('.'))

    return match.replace(gr1, typeArr.join('.'))
  })

  fs.writeFileSync('style.css', nextVersion)
}

const majorUpdate = types => {
  types[0] += 1
  types[1] = 0
  types[2] = 0

  return types
}

const minorUpdate = types => {
  types[1] += 1
  types[2] = 0

  return types
}

const patchUpdate = types => {
  types[2] += 1

  return types
}

const parseIntArr = arr => {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(arr[i])
  }
  return arr
}

const init = () => {
  const content = fs.readFileSync('style.css', 'utf8')
  const typeAvailable = ['major', 'minor', 'patch']
  let type = 'patch'
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '-t' || process.argv[i] === '-type') {
      if (typeAvailable.indexOf(process.argv[i + 1]) > -1) {
        type = process.argv[i + 1]
      }
    }
  }
  updateStyle(content, type)
}

init()
