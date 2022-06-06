export default function (array, callback) {
  const l = array.length
  var i

  for (i = 0; i < l; i++) {
    callback(array[i], i, l)
  }
}
