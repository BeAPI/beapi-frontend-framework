/**
 * Main scripts file
 */

import lazySizes from 'lazysizes'
import lazySizesBgset from 'lazysizes/plugins/bgset/ls.bgset'
require('picturefill')

/**
 * SVG Sprite
 */
let __svg__ = {
  path: '../img/icons/*.svg', // entry
  name: '../../html/assets/icons/icons.svg' // output
}
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__)
require('./src/button-href')
require('./src/console')
require('./src/ie_message')
require('./src/menu')
require('./src/lightbox')
require('./src/placeholder')

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
