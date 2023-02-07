// See https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#element-styles

module.exports = {
  "heading": {
    "color": {
      "text": "var(--wp--custom--color--dark)"
    },
    "typography": {
      "fontWeight": "600"
    }
  },
  "h1": {
    "typography": {
      "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
      "fontSize": "var(--wp--custom--typography--size--gigantic)"
    }
  },
  "h2": {
    "typography": {
      "lineHeight": "var(--wp--custom--typography--line-height--small)",
      "fontSize": "var(--wp--custom--typography--size--xxl)"
    }
  },
  "h3": {
    "typography": {
      "lineHeight": "var(--wp--custom--typography--line-height--medium)",
      "fontSize": "var(--wp--custom--typography--size--xl)",
      "fontWeight": "400"
    }
  },
  "h4": {
    "typography": {
      "lineHeight": "var(--wp--custom--typography--line-height--small)",
      "fontSize": "var(--wp--custom--typography--size--l)"
    }
  },
  "h5": {
    "typography": {
      "lineHeight": "var(--wp--custom--typography--line-height--normal)",
      "fontSize": "var(--wp--custom--typography--size--m)"
    }
  },
  "h6": {
    "typography": {
      "lineHeight": "var(--wp--custom--typography--line-height--small)",
      "fontSize": "var(--wp--custom--typography--size--s)"
    }
  },
  "link": {
    "color": {
      "text": "var(--wp--preset--color--dark)"
    }
  },
  "button": {
    "border": {
      "radius": "25px",
      "width": "0px"
    },
    "spacing": {
      "padding": "1.15rem var(--wp--custom--spacing--medium) var(--wp--custom--spacing--small) var(--wp--custom--spacing--medium)"
    },
    "color": {
      "background": "var(--wp--custom--color--primary)",
      "text": "var(--wp--custom--color--secondary)"
    },
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--secondary)",
      "fontSize": "var(--wp--custom--typography--size--m)",
      "fontWeight": "700",
      "lineHeight": "1"
    },
    ":hover": {
      "color": {
        "background": "var(--wp--custom--color--secondary)",
        "text": "var(--wp--custom--color--light)"
      }
    }
  },
  "caption": {
    "typography": {
      "fontSize": "var(--wp--preset--font-size--x-small)"
    },
    "color": {
      "text": "var(--wp--preset--color--grey-700)"
    }
  }
}