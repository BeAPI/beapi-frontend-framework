function requireAll(r) {
  r.keys().forEach(r)
}

// SVG
requireAll(require.context('../img/icons', true, /\.svg$/))

// STATIC
requireAll(require.context('../img/static', true, /\.(png|jpe?g|gif)$/))
