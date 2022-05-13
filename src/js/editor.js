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
    wp.blocks.unregisterBlockStyle('core/separator', ['wide', 'dots'])
    // whitelist core embeds
    const allowedEmbedVariants = ['youtube', 'vimeo', 'dailymotion']
    wp.blocks.getBlockVariations('core/embed').forEach((variant) => {
      if (!allowedEmbedVariants.includes(variant.name)) {
        wp.blocks.unregisterBlockVariation('core/embed', variant.name)
      }
    })
  })
}

// ACF Blocks
if (window.acf) {
  // Do stuff
}

wp.hooks.addFilter('blocks.registerBlockType', 'beapi-framework', function (settings, name) {
  if (name === 'core/list') {
    settings.example.attributes.values = '<li><a>Lorem ipsum</a></li><li><a>Dolor sit amet</a></li>'
  }

  if (name === 'core/paragraph') {
    settings.example.attributes.content = 'Lorem ipsum dolor'
    settings.example.attributes.dropCap = false
  }

  if (name === 'core/table') {
    settings.styles = []
  }

  if (name === 'core/image') {
    settings.styles = []

    settings.attributes.align = {
      type: 'string',
    }
  }

  if (name === 'core/separator' || name === 'core/quote' || name === 'core/pullquote') {
    settings.styles = []
  }

  return settings
})
