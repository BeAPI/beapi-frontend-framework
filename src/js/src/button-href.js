/**
 * Handle button href with classic link, target blank and download file
 * Warning : download file has different behavior according to used browser
 * Chrome & Edge : ✅
 * Firefox : only same origin file or it will open new tab
 * IE 10-11 : will open new tab
 */

import '../polyfill/forEach'

class ButtonLink {
  /**
   * @param {string} dataset
   */
  constructor(dataset) {
    this.dataset = dataset
    this.cntrlIsPressed = false

    this.clickHandler = this.clickHandler.bind(this)

    // document.addEventListener('keydown', this.keyDown.bind(this))
    document.addEventListener('click', this.clickHandler)
  }

  /**
   * @param {Object} e
   */
  keyDown(e) {
    if (e.which === 17) {
      this.cntrlIsPressed = true
      this.addEventListenerOnce(document, 'keyup', this.keyUp.bind(this))
    }
  }

  /**
   * @param {Object} e
   */
  keyUp(e) {
    this.cntrlIsPressed = false
  }

  /**
   * @param {Object} e
   */
  clickHandler(e) {
    const target = e.target
    if (target.tagName !== 'BUTTON' || !target.dataset.hasOwnProperty(this.dataset)) {
      return false
    }
    const download = target.getAttribute('data-target') === 'download'
    const isBlank = target.getAttribute('data-target') === '_blank'
    const href = target.getAttribute('data-href')
    const filename = target.getAttribute('data-filename')
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
  createLink(href, filename) {
    const link = document.createElement('a')
    link.href = href
    link.target = '_blank'
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

export default ButtonLink

new ButtonLink('href')
