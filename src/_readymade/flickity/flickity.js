import Flickity from 'flickity'

class SliderFlickity {
  /**
   * @param {Object} element
   * @param {Object} opts
   */
  constructor(element, opts) {
    this.element = element
    this.opts = opts
    this.isActive = false
    this.handleMatchMedia = this.handleMatchMedia.bind(this)
    this.printMediaQuery = window.matchMedia('print')
    this.printMediaQuery.addListener(this.handleMatchMedia)
    this.handleMatchMedia()
  }
  init() {
    if (!this.isActive) {
      if (document.getElementsByClassName(this.element.substring(1)).length > 0) {
        this.slider = new Flickity(this.element, this.opts)
        this.isActive = true
      }
    } else {
      return false
    }
  }
  destroy() {
    if (!this.isActive) {
      return false
    } else {
      this.slider.destroy()
      this.isActive = false
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
const flickityOptions = {
  wrapAround: true,
  prevNextButtons: false,
  contain: true,
  cellAlign: 'left',
}

new SliderFlickity('.carousel', flickityOptions)
