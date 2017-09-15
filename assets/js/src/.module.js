/**
 * [MODULE description]
 */
var MODULE = function () {
  var self = {}
  var privateVar = 10

  self.publicAttr = "bonjour"

  /**
   * [privateMethod description]
   * @return {[type]} [description]
   */
  var privateMethod = function () {
    console.log('I am private !')
  }

  /**
   * [publicMethod description]
   * @return {[type]} [description]
   */
  self.publicMethod = function () {
    console.log('I am accessible !')
  }

  return self
}

MODULE().publicMethod() // return 'I am accessible !'
MODULE().privateMethod() // return an error

console.log(MODULE().publicAttr) // return 'bonjour'
