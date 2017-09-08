const $ = require('jquery')

// Detect CTRL pressed
let cntrlIsPressed = false

$(document).keydown(function (event) {
  if (event.which === '17') {
    cntrlIsPressed = true
  }
})

$(document).keyup(function () {
  cntrlIsPressed = false
})

// Handle data-href on button components
$('body').on('mousedown', '[data-href]', function (e) {
  let href = $(this).data('href')
  let isBlank = $(this).data('target') === '_blank'
  let download = $(this).data('target') === 'download'
  let filename = $(this).data('filename')
  if (download) {
    let anchor = document.createElement('a')
    anchor.href = href
    anchor.target = '_blank'
    anchor.download = filename
    anchor.click()
  } else {
    if (isBlank || e.which === 2 || cntrlIsPressed) {
      window.open(href, '_blank')
    } else if (e.which === 1) {
      window.location.href = href
    }
  }
})