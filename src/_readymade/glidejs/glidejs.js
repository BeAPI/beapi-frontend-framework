// import Glide, { Controls, Breakpoints } from '@glidejs/glide/dist/glide.modular.esm'
import Glide from '@glidejs/glide'
import { debounce } from './utils'

class SliderGlide {
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
    this.desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
    this.desktopMediaQuery.addListener(this.handleMatchMedia)
    this.handleMatchMedia()
    window.addEventListener('resize', debounce(this.handleResize.bind(this), 250, true))
  }
  init() {
    if (this.isActive) {
      return false
    } else {
      if (document.getElementsByClassName(this.element.substring(1)).length > 0) {
        this.slider = new Glide(this.element, this.opts).mount()
        this.isActive = true
      }
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
  handleResize() {
    this.handleMatchMedia()
  }
  handleMatchMedia() {
    if (!this.printMediaQuery.matches && !this.desktopMediaQuery.matches) {
      this.init()
    } else {
      this.destroy()
    }
  }
}
const GlideOptions = {
  type: 'carousel',
  startAt: 0,
  perView: 3,
  breakpoints: {
    1024: {
      perView: 2,
    },
    600: {
      perView: 1,
    },
  },
}

new SliderGlide('.glide', GlideOptions)
