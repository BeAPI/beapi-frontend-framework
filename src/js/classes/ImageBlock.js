import AbstractDomElement from './AbstractDomElement'

// ----
// class
// ----
class ImageBlock extends AbstractDomElement {
	constructor(element, options) {
		const instance = super(element, options)

		// avoid double init :
		if (!instance.isNewInstance()) {
			return instance
		}

		const el = this._element
		const figure = el.closest('.wp-block-image')

		// Add role="figure" and aria-label with the figure text to comply with RGAA criteria 1.9.1 : https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.9
		figure.setAttribute('role', 'figure')
		figure.setAttribute('aria-label', el.textContent)
	}
}

// ----
// init
// ----
ImageBlock.init('.wp-block-image figcaption')

// ----
// export
// ----
export default ImageBlock
