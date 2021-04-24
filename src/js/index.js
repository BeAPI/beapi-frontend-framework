/**
 * Main scripts file
 */

import 'what-input'
import 'svg4everybody'
import './polyfill/picturefill'
import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import './post-build'
import './vendor/accessible-mega-menu'
import './src/menu'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}
