import AbstractDomElement from './AbstractDomElement'
import openUrlInNewTab from '../utils/openUrlInNewTab'

// ----
// class
// ----
class ButtonSeoClick extends AbstractDomElement {
	constructor(element, options) {
		const instance = super(element, options)

		// avoid double init :
		if (!instance.isNewInstance()) {
			return instance
		}

		this._element.addEventListener('click', onClickButton)
	}
}

/**
 * Only allow navigation to http(s), mailto and tel URLs, or to relative ones.
 * Blocks javascript:, data: and other schemes.
 *
 * @param {string|null} url
 * @returns {boolean}
 */
function isSafeUrl(url) {
	if (!url) {
		return false
	}

	try {
		const { protocol } = new URL(url, window.location.href)
		return ['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)
	} catch (error) {
		return false
	}
}

function onClickButton(e) {
	const target = e.currentTarget.getAttribute('data-target')
	const href = e.currentTarget.getAttribute('data-href')

	if (!isSafeUrl(href)) {
		return
	}

	if (target === '_blank') {
		openUrlInNewTab(href)
	} else {
		window.location.href = href
	}
}

// ----
// init
// ----
ButtonSeoClick.init('button[data-seo-click]')

// ----
// export
// ----
export default ButtonSeoClick
