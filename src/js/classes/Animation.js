import AbstractDomElement from './AbstractDomElement'
import each from '../utils/each'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

    gsap.registerPlugin(ScrollTrigger)

    jsAnimationOpacity()
  }
}

function jsAnimationOpacity() {
  const elements = document.querySelectorAll('.js-animation .js-animation-opacity')

  each(elements, function (element) {
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

    // TODO : animation en JS ou en CSS ?
    //timeline.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1 })
  })
}

// ----
// init
// ----
Animation.init('body')

// ----
// export
// ----
export default Animation
