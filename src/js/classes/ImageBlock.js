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
