/**
 * Wrapper for select
 */

import '../polyfill/forEach'

class Select {
  /**
   * Bind select that has to be wrapped
   * @param {string} selector
   */
  static bind(selector) {
    ;[].forEach.call(document.querySelectorAll(selector), element => new Select(element))
  }

  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element
    this.init()
  }

  init() {
    const inner = this.element.outerHTML
    this.element.outerHTML = `<div class="select--custom">${inner}</div>`
  }
}

export default Select

const selects = ['.gform_wrapper select:not([multiple])']
selects.forEach(el => Select.bind(el))
