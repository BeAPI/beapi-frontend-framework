/**
 * IE disclaimer
 */

const $ = require('jquery')

let ieUiMessage = $('.message__browserhappy')

$('.message__browserhappy button').on('click', () => {
  ieUiMessage.hide()
})