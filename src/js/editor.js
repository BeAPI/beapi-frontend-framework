import lazySizes from 'lazysizes'
import 'lazysizes/plugins/native-loading/ls.native-loading'
import 'lazysizes/plugins/object-fit/ls.object-fit'
import domReady from '@wordpress/dom-ready'
import { addFilter } from '@wordpress/hooks'
import { unregisterBlockStyle, getBlockVariations, unregisterBlockVariation } from '@wordpress/blocks'

/**
 * LazySizes configuration
 * https://github.com/aFarkas/lazysizes/#js-api---options
 */
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: false,
}

// Native Gutenberg
domReady(() => {
  unregisterBlockStyle('core/separator', ['wide', 'dots'])
  // whitelist core embeds
  const allowedEmbedVariants = ['youtube', 'vimeo', 'dailymotion']
  getBlockVariations('core/embed').forEach((variant) => {
    if (!allowedEmbedVariants.includes(variant.name)) {
      unregisterBlockVariation('core/embed', variant.name)
    }
  })
})

// ACF Blocks
if (window.acf) {
  // Do stuff
}

addFilter('blocks.registerBlockType', 'beapi-framework', function (settings, name) {
  if (name === 'core/paragraph') {
    settings.example.attributes.dropCap = false
  }

  if (name === 'core/separator' || name === 'core/quote' || name === 'core/pullquote' || name === 'core/table') {
    // remove custom styles
    settings.styles = []
  }

  if (name === 'core/image') {
    // remove custom styles
    settings.styles = []
    // set default aligment for images to null
    settings.attributes.align = {
      type: 'string',
    }
  }

  return settings
})
