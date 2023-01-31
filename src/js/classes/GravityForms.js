import AbstractDomElement from './AbstractDomElement'
import $ from 'jquery'

class GravityForms extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    this.init()
  }

  /**
   * Initialization
   */
  init() {
    this.createSubmitButton()

    // For ajax gform
    $(document).on('gform_post_render', this.createSubmitButton.bind(this))
  }

  /**
   * Replace input[type="submit"] with button[type="submit"]
   */
  createSubmitButton() {
    const el = this._element
    const { inputSubmit } = this._settings
    const $input = el.querySelector(inputSubmit)
    const $button = document.createElement('button')

    if ($input) {
      $input.getAttributeNames().map((attr) => {
        if (attr === 'value') {
          $button.innerHTML = `${$input.getAttribute(attr)}`
        } else {
          $button.setAttribute(attr, $input.getAttribute(attr))
        }
      })

      $input.parentNode.prepend($button)
      $input.parentNode.removeChild($input)
    }
  }
}

GravityForms.defaults = {
  inputSubmit: 'input[type="submit"]',
}

// ----
// init
// ----
GravityForms.init('.gform_wrapper')

// ----
// export
// ----
export default GravityForms
