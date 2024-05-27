import AbstractDomElement from './AbstractDomElement.js'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger.js'

class ScrollDirection extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    gsap.registerPlugin(ScrollTrigger)

    this._directions = ['top', 'bottom', 'up', 'down']
    this._current = null
    this._isEditable = true
    this._timer = null
    this._scrollTrigger = ScrollTrigger.create({
      trigger: this._element,
      start: 'top top',
      end: 'bottom bottom',
      markers: false,
      onUpdate: (self) => {
        const p = self.progress

        if (p === 0) {
          this.set('top')
        } else if (p === 1) {
          this.set('bottom')
        } else if (self.direction === -1) {
          this.set('up')
        } else if (self.direction === 1) {
          this.set('down')
        }
      },
    })
  }

  set(direction) {
    const newIndex = this._directions.indexOf(direction)

    if (this._isEditable && newIndex > -1 && this._current !== newIndex) {
      this._element.classList.remove('scroll-' + this._directions[this._current])
      this._element.classList.add('scroll-' + this._directions[newIndex])
      this._current = newIndex
    }

    return this
  }

  lock(delay) {
    clearTimeout(this._timer)
    this._isEditable = false

    if (typeof delay !== 'undefined') {
      this.unlock(delay)
    }

    return this
  }

  unlock(delay) {
    const that = this

    if (typeof delay !== 'undefined') {
      clearTimeout(this._timer)
      this._timer = setTimeout(function () {
        that._isEditable = true
      }, delay)
    } else {
      this._isEditable = true
    }

    return this
  }

  destroy() {
    super.destroy()
    this._scrollTrigger.kill()
    this._element.classList.remove('scroll-' + this._directions[this._current])
  }
}

// ----
// export
// ----
export default new ScrollDirection(document.documentElement)
