import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import 'what-input'
import 'svg4everybody'
import './polyfill/picturefill'
import './post-build'
import AccessibleMenu from './classes/AccessibleMenu'

// Initializations
AccessibleMenu.initFromPreset()

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}
