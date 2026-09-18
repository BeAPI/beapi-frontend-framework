import AbstractDomElement from './AbstractDomElement'

/**
 * Post sharing — copy link (desktop) and native share (mobile).
 * Button visibility is handled in CSS.
 */
class PostSharing extends AbstractDomElement {
	constructor(element, options) {
		const instance = super(element, options)

		// avoid double init :
		if (!instance.isNewInstance()) {
			return instance
		}

		const el = this._element
		const copyButton = el.querySelector('[data-action="copy"]')
		const shareButton = el.querySelector('[data-action="share"]')
		const status = el.querySelector('.post-sharing__status')

		if (!el.dataset.url || !copyButton || !status) {
			return instance
		}

		this._copyButton = copyButton
		this._shareButton = shareButton
		this._status = status

		copyButton.addEventListener('click', onClickCopy.bind(this))

		// No Web Share API: CSS shows the copy button as mobile fallback.
		if (!shareButton || typeof navigator.share !== 'function') {
			el.classList.add('post-sharing--no-native-share')
			return instance
		}

		shareButton.addEventListener('click', onClickShare.bind(this))

		return instance
	}
}

// ----
// defaults
// ----

PostSharing.defaults = {
	resetDelay: 3000,
}

// ----
// utils
// ----

/**
 * Announce a message to screen readers, then clear it.
 *
 * @param {HTMLElement} el      Status element.
 * @param {string}      message Message to announce.
 * @param {number}      delay   Duration before clearing (ms).
 */
function showTemporaryMessage(el, message, delay) {
	// Keep the live region in the accessibility tree (no `hidden`):
	// `sr-only` already hides it visually; toggling `hidden` would block announcements.
	el.textContent = message

	window.setTimeout(() => {
		el.textContent = ''
	}, delay)
}

/**
 * Swap the copy button label and icon, then restore the default state.
 *
 * @param {HTMLButtonElement} copyButton
 * @param {HTMLElement}       statusEl
 * @param {string}            copiedLabel
 * @param {number}            delay
 */
function showCopySuccess(copyButton, statusEl, copiedLabel, delay) {
	const labelEl = copyButton.querySelector('.post-sharing__label')

	if (!labelEl || copyButton.classList.contains('is-copied')) {
		return
	}

	const originalLabel = labelEl.textContent

	labelEl.textContent = copiedLabel
	copyButton.classList.add('is-copied')
	showTemporaryMessage(statusEl, copiedLabel, delay)

	window.setTimeout(() => {
		labelEl.textContent = originalLabel
		copyButton.classList.remove('is-copied')
	}, delay)
}

// ----
// events
// ----

async function onClickCopy() {
	const { url, copiedLabel, errorCopy } = this._element.dataset
	const { resetDelay } = this._settings

	try {
		await navigator.clipboard.writeText(url)
		showCopySuccess(this._copyButton, this._status, copiedLabel, resetDelay)
	} catch {
		showTemporaryMessage(this._status, errorCopy, resetDelay)
	}
}

async function onClickShare() {
	const { url, title, errorShare } = this._element.dataset
	const { resetDelay } = this._settings

	try {
		const shareData = { url }

		if (title) {
			shareData.title = title
		}

		if (navigator.canShare?.(shareData) === false) {
			showTemporaryMessage(this._status, errorShare, resetDelay)
			return
		}

		await navigator.share(shareData)
	} catch (error) {
		// User dismissed the native share sheet — not an error.
		if (error?.name !== 'AbortError') {
			showTemporaryMessage(this._status, errorShare, resetDelay)
		}
	}
}

// ----
// init
// ----
PostSharing.init('.post-sharing')

// ----
// export
// ----
export default PostSharing
