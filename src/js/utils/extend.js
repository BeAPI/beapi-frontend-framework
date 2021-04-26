import isPlainObject from './isPlainObject'

export default function extend() {
  const args = arguments
  const firstArgIsBool = typeof args[0] === 'boolean'
  const deep = firstArgIsBool ? args[0] : false
  const start = firstArgIsBool ? 1 : 0
  const rt = isPlainObject(args[start]) ? args[start] : {}
  var i
  var prop

  for (i = start + 1; i < args.length; i++) {
    for (prop in args[i]) {
      if (deep && isPlainObject(args[i][prop])) {
        rt[prop] = extend(true, {}, rt[prop], args[i][prop])
      } else if (typeof args[i][prop] !== 'undefined') {
        rt[prop] = args[i][prop]
      }
    }
  }

  return rt
}
