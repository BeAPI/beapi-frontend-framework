module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      browsers: 'last 2 versions',
      stage: 0,
    },
    'postcss-pxtorem': { propWhiteList: [] },
    'postcss-sort-media-queries': {},
  },
}
