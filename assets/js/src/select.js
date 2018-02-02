/**
 * Wrapper for select
 */

import '../polyfill/forEach'

class Select {
  /**
   * Bind select that has to be wrapped
   * @param {string} selector
   */
  static bind (selector) {
    document.querySelectorAll(selector).forEach(element => new Select(element))
  }

  /**
   * @param {HTMLElement} element
   */
  constructor (element) {
    this.element = element
    this.init()
  }

  init () {
    const inner = this.element.outerHTML
    this.element.outerHTML = `<div class="select--custom">${inner}</div>`
  }
}

export default Select