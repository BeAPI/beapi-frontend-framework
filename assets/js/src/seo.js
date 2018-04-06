/**
 * Enable full area link on card like items using a link.
 * Only one link on the title
 */

import '../polyfill/forEach'

class SeoLink {
  /**
   * Spread link of a content to his top level element
   * @param {string} selector
   */
  static bind(selector) {
    document.querySelectorAll(selector).forEach(element => new SeoLink(element))
  }

  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element
    this.element.addEventListener('click', this.handleClick.bind(this), false)
  }

  handleClick() {
    const url = this.element.querySelector().getAttribute('href')
    window.open(url, '_self')
  }
}

export default SeoLink
