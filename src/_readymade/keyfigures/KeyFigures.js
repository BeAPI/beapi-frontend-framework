// npm install countup.js --save
// https://inorganik.github.io/countUp.js/
// npm install scrollama intersection-observer --save
// https://github.com/russellgoldenberg/scrollama
import { CountUp } from 'countup.js'
import 'intersection-observer'
import scrollama from 'scrollama'

class KeyFigures {
  /**
   * Initialize CountUp and Scrollama
   * @param {String} target target to watch with scrollama
   * @param {String} item items for CountUp instance
   * @param {Boolean} observe Enable Intersection Observer on the wrapper
   * @param {Object} options CountUp options
   */
  constructor(target, item, observe = true, options = {}) {
    this.target = target
    this.wrapper = document.getElementById(this.target)
    this.items = this.wrapper.querySelectorAll(item)
    this.observe = observe
    this.options = options
    this.countUpInstances = []
    this.countUpStart = this.countUpStart.bind(this)
    this.observeWrapper = this.observeWrapper.bind(this)
  }
  /**
   * Initialize
   */
  init() {
    if (!this.wrapper) {
      return false
    }

    ;[].forEach.call(this.items, item =>
      this.countUpInstances.push(new CountUp(item, parseFloat(item.dataset.endVal), this.options))
    )

    this.observe ? this.observeWrapper() : this.countUpStart()
  }
  /**
   * Observe wrapper with scrollama
   */
  observeWrapper() {
    const scroller = scrollama()

    scroller
      .setup({
        step: `#${this.target}`,
        offset: 0.8,
      })
      .onStepEnter(response => {
        this.countUpStart()
      })
      .onStepExit(response => {
        // { element, index, direction }
      })
  }
  /**
   * Start countUp instance
   */
  countUpStart() {
    this.countUpInstances.forEach(countUp => countUp.start())
  }
}

;[].forEach.call(document.querySelectorAll('.js-key-figures'), (item, index) => {
  item.setAttribute('id', `js-key-figures-${index}`)

  const keyFigures = new KeyFigures(`js-key-figures-${index}`, '.js-countup')
  keyFigures.init()
})

export default KeyFigures
