import AbstractDomElement from './AbstractDomElement'
import { ScrollObserver, SplittedText } from 'oneloop.js'
import noop from '../utils/noop'

// ----
// shared variables
// ----
let scrollObserver

// ----
// class Animation
// ----
class Animation extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const that = this
    const el = this._element
    const s = this._settings
    const start = getValue(el, s.start)
    const end = getValue(el, s.end)

    // init scrollObserver
    if (!scrollObserver) {
      scrollObserver = new ScrollObserver()
    }

    // add animation class
    el.classList.add(s.animationClass)

    // intialize callback
    s.onInit(el)

    // add element to scrollObserver
    scrollObserver.observe(el, {
      onVisible: function (scrollInfos, percentRTE) {
        if (percentRTE >= start && percentRTE <= end && !that._isVisible) {
          // show element
          that._isVisible = true
          s.onShow(el, scrollInfos)
          el.classList.add(s.visibleClass)

          // destroy if plaOnce = true
          if (s.playOnce) {
            that.destroy(scrollInfos)
          }
        } else if ((percentRTE < start || (percentRTE > end && s.hideOnReachEnd)) && that._isVisible) {
          that._isVisible = false
          s.onHide(el, scrollInfos)
          el.classList.remove(s.visibleClass)
        }
      },
    })
  }

  isVisible() {
    return this._isVisible
  }

  destroy(scrollInfos) {
    const el = this._element
    const s = this._settings

    super.destroy()

    if (s.showOnDestroy) {
      s.onShow(el, scrollInfos || scrollObserver.getScrollInfos())
      el.classList.add(s.visibleClass)
    }

    scrollObserver.unobserve(el)

    if (!scrollObserver.hasEntry) {
      scrollObserver.destroy()
    }

    this._settings.onDestroy(el)
  }
}

// ----
// defaults
// ----
Animation.defaults = {
  animationClass: 'js-animation-opacity',
  visibleClass: 'is-visible',
  start: 0.25,
  end: 0.75,
  playOnce: false,
  hideOnReachEnd: true,
  onInit: noop,
  onShow: noop,
  onHide: noop,
  onDestroy: noop,
}

// ----
// utils
// ----
function getValue(element, value) {
  let rt = value

  if (typeof value === 'function') {
    rt = value(element)
  } else if (Array.isArray(value)) {
    rt = Math.random() * (value[1] - value[0]) + value[0]
  }

  return rt
}

// ----
// presets
// ----
Animation.preset = {
  'h1, p': undefined,
  '.card-list li': {
    animationClass: 'js-animation-translation',
    start: [0.2, 0.25],
    end: [0.75, 0.8],
    onInit: function (el) {
      const child = el.children[0]
      child.dataset.translate = Math.round(Math.random() * 100 + 100)
      child.style.transitionDuration = Math.random() * 0.75 + 0.75 + 's'
    },
    onShow: function (el, scrollInfos) {
      const child = el.children[0]
      child.style.transform = 'translateY(' + scrollInfos.directionY * -1 * child.dataset.translate + 'px)'
    },
    onHide: function (el, scrollInfos) {
      const child = el.children[0]
      child.style.transform = 'translateY(' + scrollInfos.directionY * -1 * child.dataset.translate + 'px)'
    },
  },
  'h2, h3, h4, h5, h6': {
    animationClass: 'js-animation-title',
    onInit: function (el) {
      document.fonts.ready.then(function () {
        new SplittedText(el, {
          byLine: true,
          lineWrapper: function(line) {
            return '<span class="st-line"><span>' + line + '</span></span>';
          }
        })

        const children = el.children
        const length = children.length
        let i

        if (length > 1) {
          for (i = 0; i < length; i++) {
            children[i].children[0].style.transitionDelay = (i / (length - 1)) / 5  + 's'
          }
        }

        el.classList.add('is-ready')
      })
    },
  },
}

Animation.initFromPreset()

// ----
// export
// ----
export default Animation