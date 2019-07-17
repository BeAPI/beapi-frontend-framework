/**
 * Main scripts file
 */
import './polyfill/picturefill'
import './polyfill/forEach'
import './polyfill/objectfit-polyfill'
import lazySizes from 'lazysizes'
import 'lazysizes/plugins/bgset/ls.bgset'
import 'lazysizes/plugins/native-loading/ls.native-loading'

import './src/ie_message'
import './src/menu'
import './src/button-href'
import './src/iframe'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
// lazySizes.cfg

/**
 * LazySizesBgset configuration
 * https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/bgset#lazysizes-bgset-extension---responsive-background-images
 */
// lazySizes.cfg.customMedia = {}

/**
 * LazySizesBgset configuration
 * https://github.com/aFarkas/lazysizes/blob/gh-pages/plugins/native-loading/README.md
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
}
