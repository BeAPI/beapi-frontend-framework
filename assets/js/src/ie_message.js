/**
 * IE disclaimer
 */

import '../polyfill/forEach'

const ieUiMessage = document.querySelectorAll('.message__browserhappy')
ieUiMessage.forEach(el => {
  el.querySelector('button').addEventListener('click', () => (el.style.display = 'none'))
})