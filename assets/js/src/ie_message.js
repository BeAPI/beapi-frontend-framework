/**
 * IE disclaimer
 */

var $ = require('jquery')

var ieUiMessage = $('.message__browserhappy')

$('.message__browserhappy button').on('click', function () {
  ieUiMessage.hide()
})