/**
 * Wrapper for select
 */
var $ = require('jquery')

var customSelect = $('.gform_wrapper select:not([multiple])')

customSelect.wrap("<div class='select--custom'/>")
