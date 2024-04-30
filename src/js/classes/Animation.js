import AbstractDomElement from './AbstractDomElement'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import noop from '../utils/noop'

// ----
// class
// ----
class Animation extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    // Register gsap plugins
    gsap.registerPlugin(ScrollTrigger)

    const el = this._element
    const settings = this._settings

    // add animation class
    el.classList.add(settings.animationClass)

    this.scrollTrigger(el)
  }

  scrollTrigger(element) {
    const settings = this._settings

    ScrollTrigger.create({
      trigger: element,
      start: settings.start,
      end: settings.end,
      markers: true, // Markers is a visual aid that helps us set start and end points.
      toggleClass: settings.visibleClass,
      once: settings.playOnce,
      onEnter: ({ progress, direction, isActive }) => settings.onEnter(progress, direction, isActive),
      onLeave: ({ progress, direction, isActive }) => settings.onLeave(progress, direction, isActive),
    })

    /*
    // TODO : animation en JS ou en CSS ?
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 85%', // when the top of the trigger hits 75% of the top of the viewport
        end: 'bottom 15%',
        markers: true, // Markers is a visual aid that helps us set start and end points.
        toggleClass: 'is-visible',
        once: false,
      },
    })

    timeline.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1 })
    */
  }
}

// ----
// defaults
// ----
Animation.defaults = {
  // wanted animation, the class will be added on the element if is not already on it
  animationClass: 'js-animation-opacity',
  // class added when the element is in the start/end range
  visibleClass: 'is-visible',
  // start : The ScrollTrigger's starting scroll position (numeric, in pixels). Reflect the scroll position in pixels
  start: 'top 85%',
  // end : The ScrollTrigger's ending scroll position (numeric, in pixels). Reflect the scroll position in pixels
  end: 'bottom 15%',
  // if true, the instance will be destroyed after the element is visible
  playOnce: false,
  onEnter: noop,
  onLeave: noop,
}

// ----
// presets
// ----
Animation.preset = {
  '.js-animation .js-animation-opacity': undefined,
  '.js-animation .js-animation-translation': {
    animationClass: 'js-animation-translation',
  },
}

// ----
// presets
// ----
Animation.initFromPreset()

// ----
// export
// ----
export default Animation
