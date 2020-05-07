import Isotope from 'isotope-layout'

class IsotopeGrid {
  /**
   * @param {Object} element
   * @param {Object} opts
   */
  constructor(element, opts) {
    this.element = element
    this.opts = opts
    this.handleMatchMedia = this.handleMatchMedia.bind(this)
    this.printMediaQuery = window.matchMedia('print')
    this.printMediaQuery.addListener(this.handleMatchMedia)
    this.handleMatchMedia()
  }
  init() {
    if (document.getElementsByClassName(this.element.substring(1)).length > 0) {
      this.isotopeM = new Isotope(this.element, this.opts)
      this.isactive = true
    } else {
      return false
    }
  }
  destroy() {
    if (!this.isactive) {
      return false
    } else {
      this.isotopeM.destroy()
      this.isactive = false
    }
  }
  handleMatchMedia() {
    if (!this.printMediaQuery.matches) {
      this.init()
    } else {
      this.destroy()
    }
  }
}
const isotopeOptions = {
  itemSelector: '.archive__item',
  masonry: {
    columnWidth: '.archive__grid-sizer',
    horizontalOrder: true,
  },
}

new IsotopeGrid('.archive__grid-iso', isotopeOptions)
