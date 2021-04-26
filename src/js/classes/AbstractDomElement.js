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

import extend from '../utils/extend.js'

class AbstractDomElement {
  constructor(element, options) {
    let oldInstance

    // provide an explicit spaceName to prevent conflict after minification
    // MaClass.nameSpace = 'MaClass'
    this.constructor.nameSpace = this.constructor.nameSpace || this.constructor.name
    const nameSpace = this.constructor.nameSpace

    // if no spacename beapi, create it - avoid futur test
    if (!element.beapi) {
      element.beapi = {}
    }

    oldInstance = element.beapi[nameSpace]

    if (oldInstance) {
      console.warn(
        '[AbstractDomElement] more than 1 class is initialised with the same name space on :',
        element,
        oldInstance
      )
      oldInstance._isNewInstance = false
      return oldInstance
    }

    this._element = element
    this._settings = extend(true, {}, this.constructor.defaults, options)
    this._element.beapi[nameSpace] = this
    this._isNewInstance = true
  }

  isNewInstance() {
    return this._isNewInstance
  }

  destroy() {
    this._element.beapi[this.constructor.nameSpace] = undefined
    return this
  }

  static init(element, options) {
    foreach(element, (el) => {
      new this(el, options)
    })

    return this
  }

  static hasInstance(element) {
    const el = getDomElement(element)
    return el && el.beapi && !!el.beapi[this.nameSpace]
  }

  static getInstance(element) {
    const el = getDomElement(element)
    return el && el.beapi ? el.beapi[this.nameSpace] : undefined
  }

  static destroy(element) {
    this.foreach(element, (el) => {
      if (el.beapi && el.beapi[this.nameSpace]) {
        el.beapi[this.nameSpace].destroy()
      }
    })

    return this
  }

  static foreach(element, callback) {
    foreach(element, (el) => {
      if (el.beapi && el.beapi[this.nameSpace]) {
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
    if (callback(el[i]) === false) {
      break
    }
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
