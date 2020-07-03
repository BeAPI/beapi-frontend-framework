/*
  How to use :

  class MyClass extends AbstractDomElement {
    constructor(element, options) {
      const instance = super(element, options)

      // avoid double init :
      if (!instance.isNewInstance()) {
        return instance
      }

      // init of MyClass
      // ...
    }
  }

  MyClass.defaults = {

  }

  MyClass.preset = {
    '.selector' : {this object will be extended with defaults options}
  }

  // loop on each preset
  MyClass.initFromPreset()

*/

const $ = jQuery

class AbstractDomElement {
  constructor(element, options, nameSpace) {
    let oldInstance

    // provide an explicit spaceName to prevent conflict after minification
    // keep this.constructor.name for retro compatibility
    nameSpace = nameSpace || this.constructor.name

    // if no spacename beapi, create it - avoid futur test
    if (!element.beapi) {
      element.beapi = {}
    }

    oldInstance = element.beapi[nameSpace]

    if (oldInstance) {
      oldInstance._isNewInstance = false
      return oldInstance
    }

    this._element = element
    this._settings = $.extend(true, {}, this.constructor.defaults, options)
    this._element.beapi[nameSpace] = this
    this._isNewInstance = true
  }

  isNewInstance() {
    return this._isNewInstance
  }

  destroy() {
    this._element.beapi[this.constructor.name] = undefined
    return this
  }

  static init(element, options) {
    foreach(element, el => {
      new this(el, options)
    })

    return this
  }

  static hasInstance(element) {
    const el = getDomElement(element)
    return el && el.beapi && !!el.beapi[this.name]
  }

  static getInstance(element) {
    const el = getDomElement(element)
    return el && el.beapi ? el.beapi[this.name] : undefined
  }

  static destroy(element) {
    this.foreach(element, el => {
      if (el.beapi && el.beapi[this.name]) {
        el.beapi[this.name].destroy()
      }
    })

    return this
  }

  static foreach(element, callback) {
    foreach(element, el => {
      if (el.beapi && el.beapi[this.name]) {
        callback(el)
      }
    })

    return this
  }

  static initFromPreset() {
    const preset = this.preset
    let selector

    for (selector in preset) {
      this.init(selector, preset[selector])
    }

    return this
  }

  static destroyFromPreset() {
    const preset = this.preset
    let selector

    for (selector in preset) {
      this.destroy(selector)
    }

    return this
  }
}

// ----
// utils
// ----
function foreach(element, callback) {
  const el = getDomElements(element)
  let i

  for (i = 0; i < el.length; i++) {
    if (callback(el[i]) === false) break
  }
}

function getDomElements(element) {
  return typeof element === 'string' ? document.querySelectorAll(element) : element.length >= 0 ? element : [element]
}

function getDomElement(element) {
  return getDomElements(element)[0]
}

// ----
// export
// ----
export default AbstractDomElement
