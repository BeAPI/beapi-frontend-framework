/* global BEAPI_EDITOR_SETTINGS */

/* Customize BEAPI_EDITOR_SETTINGS in inc/Services/Editor.php or with `bff_editor_custom_settings` filter (see readme). */
import domReady from '@wordpress/dom-ready'
import { subscribe } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { unregisterBlockStyle, getBlockVariations, getBlockType, unregisterBlockVariation } from '@wordpress/blocks'
import './utils/beapi'

const unregisterDisabledBlockStyles = () => {
	if (!BEAPI_EDITOR_SETTINGS.disabledBlocksStyles) {
		return
	}

	Object.entries(BEAPI_EDITOR_SETTINGS.disabledBlocksStyles).forEach(([blockName, styles]) => {
		;[].concat(styles).forEach((styleName) => {
			unregisterBlockStyle(blockName, styleName)
		})
	})
}

const unregisterDisallowedBlockVariations = () => {
	if (!BEAPI_EDITOR_SETTINGS.allowedBlocksVariations) {
		return
	}

	Object.entries(BEAPI_EDITOR_SETTINGS.allowedBlocksVariations).forEach(([blockName, allowedVariationNames]) => {
		const blockVariations = getBlockVariations(blockName) || []

		blockVariations.forEach((variation) => {
			if (!allowedVariationNames.includes(variation.name)) {
				unregisterBlockVariation(blockName, variation.name)
			}
		})
	})
}

const whenBlocksRegistered = (blockNames, callback) => {
	const areBlocksReady = () => blockNames.every((blockName) => getBlockType(blockName))

	if (areBlocksReady()) {
		callback()
		return
	}

	const unsubscribe = subscribe(() => {
		if (!areBlocksReady()) {
			return
		}

		unsubscribe()
		callback()
	})
}

// Native Gutenberg
domReady(() => {
	unregisterDisabledBlockStyles()

	if (BEAPI_EDITOR_SETTINGS.allowedBlocksVariations) {
		const blockNames = Object.keys(BEAPI_EDITOR_SETTINGS.allowedBlocksVariations)

		whenBlocksRegistered(blockNames, unregisterDisallowedBlockVariations)
	}
})

// ACF Blocks
if (window.acf) {
	// Do stuff
}

addFilter('blocks.registerBlockType', 'beapi-framework', function (settings, name) {
	// Disable all styles
	if (BEAPI_EDITOR_SETTINGS.disableAllBlocksStyles && BEAPI_EDITOR_SETTINGS.disableAllBlocksStyles.includes(name)) {
		settings.styles = []
	}

	return settings
})
