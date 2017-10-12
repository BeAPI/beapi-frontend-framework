/**
 * Main scripts file
 */

const lazySizes = require('lazysizes')
const lazySizesBgset = require('lazysizes/plugins/bgset/ls.bgset')
require('picturefill')

require('./src/button-href')
require('./src/ie_message')
require('./src/menu')
require('./src/placeholder')
require('./src/scripts-domready')
require('./src/select')

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.customMedia = {}

/**
 * LazySizesBgset configuration
 * https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/bgset#lazysizes-bgset-extension---responsive-background-images
 */
lazySizesBgset.customMedia = {}
