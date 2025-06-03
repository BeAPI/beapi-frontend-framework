/* global BFFEditorSettings */

/* Customize BFFEditorSettings in inc/Services/Editor.php or with `bff_editor_custom_settings` filter (see readme). */

import domReady from '@wordpress/dom-ready'
import { addFilter } from '@wordpress/hooks'
import { unregisterBlockStyle, getBlockVariations, unregisterBlockVariation } from '@wordpress/blocks'

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
