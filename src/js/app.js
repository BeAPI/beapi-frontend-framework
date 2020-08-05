/**
 * Main scripts file
 */

import 'what-input'
import './polyfill/picturefill'
import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import './vendor/accessible-mega-menu'
import './src/menu'

// SVG SPRITE INJECTION
function requireAll(r) {
  r.keys().forEach(r)
}

requireAll(require.context('../img/icons', true, /\.svg$/))

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}
