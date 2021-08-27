import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

// Native Gutenberg
if (typeof wp !== 'undefined') {
  wp.domReady(() => {
    // Do stuff
  })
}

// ACF Blocks
if (window.acf) {
  // Do stuff
}
