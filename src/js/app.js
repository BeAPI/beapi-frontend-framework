/**
 * Main scripts file
 */
import './polyfill/picturefill'
import './polyfill/forEach'
import lazySizes from 'lazysizes'
import lazySizesBgset from 'lazysizes/plugins/bgset/ls.bgset'

import './src/menu'
import './src/button-href'
import './src/select'
import './src/seo'
import AccessibilityTests from './src/accessibility-tests'

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

/**
 * Automate a11y tests only in our dist folder
 */

if (window.location.hostname === 'localhost' || window.location.pathname.includes('/dist/')) {
  const accessibilityTests = new AccessibilityTests()
  accessibilityTests.init()
  window.scroll(0, 0)
}
