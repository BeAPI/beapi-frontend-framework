/**
 * Handle button href with classic link, target blank and download file
 * Warning : download file has different behavior according to used browser
 * Chrome & Edge : ✅
 * Firefox : only same origin file or it will open new tab
 * IE 10-11 : will open new tab
 */
class ButtonLink {
  /**
   * Bind button link behavior on targeted elements
   * @param {string} selector
   */
  static bind (selector) {
    document.querySelectorAll(selector).forEach(element => new ButtonLink(element))
  }

  /**
   * @param {HTMLElement} element
   */
  constructor (element) {
    this.element = element
    this.cntrlIsPressed = false

    document.addEventListener('keydown', this.keyDown.bind(this))
    this.element.addEventListener('click', this.clickHandler.bind(this))
  }

  /**
   * @param {Object} e
   */
  keyDown (e) {
    if (e.which === 17) {
      this.cntrlIsPressed = true
      this.addEventListenerOnce(document, 'keyup', this.keyUp.bind(this))
    }
  }

  /**
   * @param {Object} e
   */
  keyUp (e) {
    this.cntrlIsPressed = false
  }

  /**
   * @param {HTMLElement} element
   * @param {Object} event
   * @param {function} fn
   */
  addEventListenerOnce (element, event, fn) {
    let func = function () {
      element.removeEventListener(event, func)
      fn()
    }
    element.addEventListener(event, func)
  }

  /**
   * @param {Object} e
   */
  clickHandler (e) {
    let download = this.element.getAttribute('data-target') === 'download'
    let isBlank = this.element.getAttribute('data-target') === '_blank'
    let href = this.element.getAttribute('data-href')
    let filename = this.element.getAttribute('data-filename')
    if (download) {
      this.createLink(href, filename)
    } else {
      if (isBlank || e.which === 2 || this.cntrlIsPressed) {
        window.open(href, '_blank')
      } else if (e.which === 1) {
        window.location.href = href
      }
    }
  }

  /**
   * @param {String} href
   * @param {String} filename
   */
  createLink (href, filename) {
    let link = document.createElement('a')
    link.href = href
    link.target = '_blank'
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

ButtonLink.bind('button[data-href]')