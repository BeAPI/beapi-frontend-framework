/**
 * This polyfill adds compatibility to all Browsers supporting ES5
 */
/* global NodeList */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = (callback, thisArg) => {
    thisArg = thisArg || window
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}