import AbstractDomElement from './AbstractDomElement.js'
import { ScrollObserver } from 'oneloop.js'

class ScrollDirection extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const that = this

    this._scrollObserver = new ScrollObserver()
    this._directions = ['top', 'bottom', 'up', 'down']
    this._current = null
    this._isEditable = true
    this._timer = null

    this._scrollObserver.observe(this._element, {
      onAlways: function (scroll, percent, percent2) {
        const p = Math.min(Math.round(percent2 * 100), 100)

        if (p === 0) {
          that.set('top')
        } else if (p === 100) {
          that.set('bottom')
        } else if (scroll.directionY === -1) {
          that.set('up')
        } else if (scroll.directionY === 1) {
          that.set('down')
        }
      },
    })

    that.set('top')
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
    this._scrollObserver.unobserve(this._element)
    this._element.classList.remove('scroll-' + this._directions[this._current])
  }
}

// ----
// export
// ----
export default new ScrollDirection(document.documentElement)
