// See https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#settings

const color = require('./settings/color')
const custom = require('./settings/custom')
const spacing = require('./settings/spacing')
const typography = require('./settings/typography')
const blocks = require('./settings/blocks/blocks.js')

module.exports = {
  "appearanceTools": true,
  "useRootPaddingAwareAlignments": true,
  "layout": {
    "contentSize": "760px",
    "wideSize": "1160px"
  },
  "custom": custom,
  "color": color,
  "spacing": spacing,
  "typography": typography,
  "blocks": blocks
}