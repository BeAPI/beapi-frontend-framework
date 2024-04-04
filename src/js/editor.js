/*global BFFEditorSettings*/

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
  // Disable specific block styles
  if (BFFEditorSettings.disabledBlocksStyles) {
    Object.entries(BFFEditorSettings.disabledBlocksStyles).forEach(([block, styles]) => {
      unregisterBlockStyle(block, styles)
    })
  }

  // Allow blocks variations
  if (BFFEditorSettings.allowedBlocksVariations) {
    Object.entries(BFFEditorSettings.allowedBlocksVariations).forEach(([block, variations]) => {
      getBlockVariations(block).forEach((variant) => {
        if (!variations.includes(variant.name)) {
          unregisterBlockVariation(block, variant.name)
        }
      })
    })
  }
})

// ACF Blocks
if (window.acf) {
  // Do stuff
}

addFilter('blocks.registerBlockType', 'beapi-framework', function (settings, name) {
  // Disable all styles
  if (BFFEditorSettings.disableAllBlocksStyles && BFFEditorSettings.disableAllBlocksStyles.includes(name)) {
    settings.styles = []
  }

  return settings
})
