/**
 * Handle button href with classic link, target blank and download file
 * Warning : download file has different behavior according to used browser
 * Chrome & Edge : ✅
 * Firefox : only same origin file or it will open new tab
 * IE 10-11 : will open new tab
 */

class ButtonLink {
  /**
   * @param {string} dataset
   */
  constructor(dataset) {
    this.dataset = dataset
    this.cntrlIsPressed = false
    this.keyCode = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? 91 : 17

    this.clickHandler = this.clickHandler.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)

    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('keyup', this.keyUp)
    document.addEventListener('click', this.clickHandler)
  }

  /**
   * @param {Object} e
   */
  keyDown(e) {
    if (e.which !== this.keyCode) {
      return false
    }
    this.cntrlIsPressed = true
  }

  /**
   * @param {Object} e
   */
  keyUp(e) {
    if (e.which !== this.keyCode) {
      return false
    }
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
