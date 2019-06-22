/**
 * Main scripts file
 */
import './polyfill/picturefill'
import './polyfill/forEach'
import './polyfill/objectfit-polyfill'
import lazySizes from 'lazysizes'
import lazySizesBgset from 'lazysizes/plugins/bgset/ls.bgset'

import './src/ie_message'
import './src/menu'
import './src/button-href'
import './src/wrapper'
// import './src/KeyFigures'

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
