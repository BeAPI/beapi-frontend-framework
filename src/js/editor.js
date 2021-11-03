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
    // core/button
    wp.blocks.unregisterBlockStyle('core/button', 'outline')

    // core/quote
    wp.blocks.unregisterBlockStyle('core/quote', 'large')
  })
}

// ACF Blocks
if (window.acf) {
  // Do stuff
}
