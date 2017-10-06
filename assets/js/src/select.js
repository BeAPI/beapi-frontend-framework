/**
 * Wrapper for select
 */
const $ = require('jquery')

const selects = [
  '.gform_wrapper select:not([multiple])'
]

for (let i = 0; i < selects.length; i++) {
  $(selects[i]).wrap("<div class='select--custom'/>")
}