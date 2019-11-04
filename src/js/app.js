/**
 * Main scripts file
 */

import './polyfill/picturefill'
import './polyfill/objectfit-polyfill'
import lazySizes from 'lazysizes'
import 'lazysizes/plugins/bgset/ls.bgset'
import 'lazysizes/plugins/native-loading/ls.native-loading'

import './src/menu'
import './src/button-href'
import './src/wrapper'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}
