const color = require('./settings/color.js')
const custom = require('./settings/custom')
const spacing = require('./settings/spacing')
const typography = require('./settings/typography')

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
  "typography": typography
}