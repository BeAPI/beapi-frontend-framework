import AbstractDomElement from './AbstractDomElement'
import noop from '../utils/noop'
import each from '../utils/each'
import { ScrollObserver, Tween, easings, SplittedText } from 'oneloop.js'

// ----
// const
// ----
const scrollObserver = new ScrollObserver()

// ----
// class
// ----
class Animations extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const that = this
    const s = this._settings
    const showAt = typeof s.showAt === 'function' ? s.showAt() : s.showAt

    this._isVisible = false

    this._element.classList.add(s.hiddenClass, s.animationTypeClass)

    if (showAt) {
      scrollObserver.observe(this._element, {
        onVisible: function (scrollInfo, percentRTW) {
          if (!that.isVisible() && percentRTW > showAt) {
            that.show()
          }
        },
      })
    }

    s.onInit.call(this)
  }

  isVisible() {
    return this._isVisible
  }

  show() {
    const s = this._settings

    this._isVisible = true

    s.onShow.call(this)
    this._element.classList.add(s.visibleClass)
    this._element.classList.remove(s.hiddenClass)

    return this
  }

  hide() {
    const s = this._settings

    this._isVisible = false

    s.onHide.call(this)
    this._element.classList.add(s.hiddenClass)
    this._element.classList.remove(s.visibleClass)

    return this
  }

  destroy() {
    const s = this._settings

    if (s.showOnDestroy) {
      if (!this._isVisible) {
        this.show()
      }
    } else {
      this.hide()
    }

    scrollObserver.unobserve(this._element)
    super.destroy()
  }

  /**
   * Line by line generic animation
   * @param element
   */
  static lineByLine(element) {
    Animations.init(element, {
      animationTypeClass: 'animate-line-by-line',
      onShow: function () {
        const el = this._element
        const that = this

        // If element is not empty -> example <h1></h1>
        if (el.innerHTML.trim().length !== 0) {
          const splittedText = new SplittedText(el, {
            byLine: true,
          })

          const lines = el.getElementsByClassName('st-line')

          each(lines, function (line, i, l) {
            line.style.opacity = 0

            new Tween({
              delay: i * 50,
              duration: 500 - i * 25,
              onUpdate: function (timestamp, tick, percent) {
                line.style.opacity = percent
                line.style.transform = 'translateY(' + (1 - easings.easeOutSine(percent)) * (50 + i * 10) + 'px)'
              },
              /* eslint-disable-next-line */
              onComplete: i !== l - 1 ? undefined : function () {
                      splittedText.destroy()
                    },
            })
          })
        }

        that.destroy()
      },
    })
  }

  /**
   * Opacity generic animation
   * @param element
   */
  static opacity(element) {
    Animations.init(element, {
      animationTypeClass: 'animate-opacity',
      onShow: function () {
        const el = this._element
        const that = this

        el.style.opacity = 0

        new Tween({
          duration: 1000,
          onUpdate: function (timestamp, tick, percent) {
            el.style.opacity = percent
          },
        })

        that.destroy()
      },
    })
  }

  /**
   * Fade up generic animation
   * @param element
   * @param delay
   */
  static fadeUp(element, delay) {
    delay = delay || 0

    Animations.init(element, {
      animationTypeClass: 'animate-fade-up',
      onShow: function () {
        const el = this._element
        const that = this

        el.style.opacity = 0

        new Tween({
          delay: delay,
          duration: 1000,
          onUpdate: function (timestamp, tick, percent) {
            el.style.opacity = Math.min(percent * 2, 1)
            el.style.transform = 'translateY(' + 100 * (1 - easings.easeOutExpo(percent)) + 'px)'
          },
        })

        that.destroy()
      },
    })
  }
}

// ----
// defaults
// ----
Animations.defaults = {
  showOnDestroy: true,
  animationTypeClass: '',
  hiddenClass: 'is-hidden',
  visibleClass: 'is-visible',
  showAt: 0.15, // percent, function or null
  onInit: noop,
  onShow: noop,
  onHide: noop,
  onDestroy: noop,
}

// ----
// export
// ----
export default Animations
