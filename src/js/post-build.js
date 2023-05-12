function requireAll(r) {
  r.keys().forEach(r)
}

requireAll(require.context('../img', true, /\.(png|jpe?g|gif|svg)$/))
