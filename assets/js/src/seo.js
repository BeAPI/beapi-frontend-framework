/**
 * Enable full area link on card like items using a link.
 * Only one link on the title
 */
// Dependencies
const $ = require('jquery')

var $seoItem = $('[data-seo]')

$seoItem.on('click', function () {
  var $this = $(this)
  var seoUrl = $this.find('a').attr('href')
  window.open(seoUrl, '_self')
})