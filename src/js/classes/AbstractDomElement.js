import extend from '../utils/extend'

class AbstractDomElement {
  /**
   * AbstractDomElement
   * @constructor
   * @version 3.0.0
   * @param {NodeElement} element
   * @param {Object} options
   * @return {Object} this
   */
  constructor(element, options) {
    const childClass = this.constructor
    const oldInstance = childClass.getInstance(element)

    // if new AbstractDomElement() is called
    if (childClass === AbstractDomElement) {
      console.error("[AbstractDomElement] : AbstractDomElement can't be instancied directly")
    }

    // if instances static property has not been set on child class
    if (!childClass.instances) {
      childClass.instances = []
    }

    // if element already been initialized, return old instance
    if (oldInstance) {
      console.warn('[' + childClass.name + '] : Is already instancied on : ', element)
      this._isNewInstance = false
      return oldInstance
    }

    // add instance to child class instances property
    childClass.instances.push(this)

    this._element = element
    this._isNewInstance = true
    this._settings = buildSettings(childClass, options)

    if (this._settings.autoRegisterChildren) {
      this.registerChildren()
    }

    if (this._settings.autoInit) {
      this.init()
    }
  }

  /**
   * init : the purpose of this method is to be overrided in child class
   * @abstract
   * @return {Object} this
   */
  init() {
    return this
  }

  /**
   * isNewInstance : tell if element has been instancied more than once
   * @return {Boolean}
   */
  isNewInstance() {
    return this._isNewInstance
  }

  /**
   * getElement : get the element given at the class initialisation
   * @return {NodeElement}
   */
  getElement() {
    return this._element
  }

  /**
   * registerChildren : register elements matching selectors options
   * @return {Object} this
   */
  registerChildren() {
    const selectors = this._settings.selectors

    for (let name in selectors) {
      this['_' + name] = this.find(selectors[name])
    }

    return this
  }

  /**
   * find : shortcut for querySelectorAll inside element
   * @return {NodeList}
   */
  find(selector) {
    return this._element.querySelectorAll(selector)
  }

  /**
   * destroy : remove instance from child class
   * @return {Undefined}
   */
  destroy() {
    const childClass = this.constructor
    childClass.instances.splice(childClass.instances.indexOf(this), 1)
  }

  /**
   * init
   * @return {Object} this
   */
  static init(targets, options) {
    const presets = this.presets
    const argsLength = arguments.length

    if (argsLength === 0) {
      if (this.presets) {
        for (let selector in presets) {
          this.init(selector, presets[selector])
        }
      }
    } else {
      if (!options && typeof targets === 'string' && presets && presets[targets]) {
        options = presets[targets]
      }

      const elements = getDomElements(targets)

      for (let i = 0; i < elements.length; i++) {
        new this(elements[i], options)
      }
    }

    return this
  }

  /**
   * hasInstance
   * @param {String|NodeElement|NodeList} target
   * @return {Boolean}
   */
  static hasInstance(target) {
    const instances = this.instances || []
    target = getDomElement(target)

    for (let i = 0; i < instances.length; i++) {
      if (instances[i].getElement() === target) {
        return true
      }
    }

    return false
  }

  /**
   * getInstance
   * @param {String|NodeElement|NodeList} target
   * @return {Object|null}
   */
  static getInstance(target) {
    const instances = this.instances || []
    target = getDomElement(target)

    for (let i = 0; i < instances.length; i++) {
      if (instances[i].getElement() === target) {
        return instances[i]
      }
    }

    return null
  }

  /**
   * foreach
   * @param {String|NodeElement|NodeList|Function} targets
   * @param {Function} callback
   * @return {Object} this
   */
  static foreach(targets, callback) {
    const instances = this.instances || []

    if (typeof targets === 'function') {
      callback = targets

      for (let i = 0; i < instances.length; i++) {
        callback(instances[i])
      }
    } else {
      const elements = getDomElements(targets)

      for (let i = 0; i < elements.length; i++) {
        let instance = this.getInstance(elements[i])

        if (instance) {
          callback(instance)
        }
      }
    }

    return this
  }

  /**
   * destroy
   * @param {String|NodeElement|NodeList|undefined} targets
   * @return {Object} this
   */
  static destroy(targets) {
    const instances = this.instances || []

    if (targets) {
      let elements = getDomElements(targets)

      for (let i = 0; i < elements.length; i++) {
        let instance = this.getInstance(elements[i])
        if (instance) {
          instance.destroy()
        }
      }
    } else {
      while (instances[0]) {
        instances[0].destroy()
      }
    }

    return this
  }
}

// ----
// utils
// ----
function getDomElements(element) {
  return typeof element === 'string' ? document.querySelectorAll(element) : element.length >= 0 ? element : [element]
}

function getDomElement(element) {
  return typeof element === 'string' ? document.querySelector(element) : element.length >= 0 ? element[0] : element
}

function buildSettings(childClass, options) {
  const array = [options, childClass.defaults]
  const abstractDomElementProto = Object.getPrototypeOf(AbstractDomElement)
  let proto = Object.getPrototypeOf(childClass)

  while (proto && proto !== abstractDomElementProto) {
    if (proto.defaults) {
      array.push(proto.defaults)
    }

    proto = Object.getPrototypeOf(proto.constructor)
  }

  array.push(AbstractDomElement.defaults, {}, true)

  return extend.apply(null, array.reverse())
}

// ----
// static props
// ----
AbstractDomElement.defaults = {
  autoInit: true,
  autoRegisterChildren: true,
  selectors: {
    // name: 'selector' will create this._name = nodeList if autoRegisterChildren is set to true
    // buttons: '.button' will create this._buttons = nodeList
  },
}

export default AbstractDomElement
