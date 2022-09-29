import Animations from '../../../classes/animations/Animations'
import { Tween } from 'oneloop.js'

// ----
// Animate custom example
// ----
Animations.init(
  `
    .animations-example .animation-4
  `,
  {
    animationTypeClass: 'animate-custom-example',
    onShow: function () {
      const el = this._element
      const text = el.querySelector('p')

      text.style.opacity = 0

      new Tween({
        duration: 600,
        easing: 'easeOutSine',
        onUpdate: function (timestamp, tick, percent) {
          el.style.transformOrigin = 'left'
          el.style.transform = 'scaleX(' + percent + ')'
        },
        onComplete: function () {
          new Tween({
            easing: 'easeOutExpo',
            onUpdate: function (timestamp, tick, percent) {
              text.style.opacity = percent
            },
          })
        },
      })

      this.destroy()
    },
  }
)
