function requireAll(r) {
  r.keys().forEach(r)
}

// SVG
requireAll(require.context('../img/icons', true, /\.svg$/))

// DEFAULT
requireAll(require.context('../img/default', true, /\.(png|jpe?g)$/))

// STATIC
requireAll(require.context('../img/static', true, /\.(png|jpe?g|gif)$/))
