const elements = require('./styles/elements.js')
const blocks = require('./styles/blocks.js')

module.exports = {
  "typography": {
    "fontFamily": "var(--wp--preset--font-family--primary)",
    "lineHeight": "var(--wp--custom--typography--line-height--normal)",
    "fontSize": "var(--wp--custom--typography--font-size--small)",
    "fontWeight": "400"
  },
  "color": {
    "background": "var(--wp--custom--color--light)",
    "text": "var(--wp--custom--color--dark)"
  },
  "spacing": {
    "blockGap": "2.5rem",
    "padding": {
      "top": "1rem",
      "right": "1rem",
      "bottom": "1rem",
      "left": "1rem"
    }
  },
  "elements": elements,
  "blocks": blocks
}