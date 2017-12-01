const $ = require('jquery')

// Detect CTRL pressed
let cntrlIsPressed = false

$(document).keydown(event => {
  if (event.which === '17') {
    cntrlIsPressed = true
  }
})

$(document).keyup(() => {
  cntrlIsPressed = false
})

/**
 * Handle button href with classic link, target blank and download file
 * Warning : download file has different behavior according to used browser
 * Chrome & Edge : ✅
 * Firefox : only same origin file or it will open new tab
 * IE 10-11 : will open new tab
 */
$('body').on('mousedown', '[data-href]', (e) => {
  let $this = $(e.currentTarget)
  let href = $this.data('href')
  let isBlank = $this.data('target') === '_blank'
  let download = $this.data('target') === 'download'
  let filename = $this.data('filename')
  if (download) {
    let $anchor = document.createElement('a')
    $this.append($anchor)
    $anchor.href = href
    $anchor.target = '_blank'
    $anchor.download = filename
    $anchor.click()
    $anchor.remove()
  } else {
    if (isBlank || e.which === 2 || cntrlIsPressed) {
      window.open(href, '_blank')
    } else if (e.which === 1) {
      window.location.href = href
    }
  }
})