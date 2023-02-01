module.exports = {
  "typography": {
    "fontFamily": "var(--wp--preset--font-family--primary)",
    "lineHeight": "var(--wp--custom--typography--line-height--normal)",
    "fontSize": "var(--wp--preset--font-size--small)",
    "fontWeight": "400"
  },
  "color": {
    "background": "var(--wp--preset--color--light)",
    "text": "var(--wp--preset--color--dark)"
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
  "elements": {
    "heading": {
      "typography": {
        "fontWeight": "400"
      }
    },
    "h1": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
        "fontSize": "var(--wp--preset--font-size--colossal)"
      }
    },
    "h2": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--small)",
        "fontSize": "var(--wp--preset--font-size--gigantic)"
      }
    },
    "h3": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
        "fontSize": "var(--wp--preset--font-size--huge)"
      }
    },
    "h4": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
        "fontSize": "var(--wp--preset--font-size--x-large)"
      }
    },
    "h5": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--normal)",
        "fontSize": "var(--wp--preset--font-size--large)"
      }
    },
    "h6": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--normal)",
        "fontSize": "var(--wp--preset--font-size--medium)"
      }
    },
    "link": {
      "color": {
        "text": "var(--wp--preset--color--dark)"
      }
    },
    "button": {
      "border": {
        "radius": "10px",
        "width": "0px"
      },
      "spacing": {
        "padding": "var(--wp--custom--spacing--medium)"
      },
      "color": {
        "background": "var(--wp--preset--color--primary)",
        "text": "var(--wp--preset--color--dark)"
      },
      "typography": {
        "fontSize": "var(--wp--preset--font-size--x-small)",
        "fontWeight": "700",
        "lineHeight": "1"
      },
      ":hover": {
        "color": {
          "background": "var(--wp--preset--color--dark)",
          "text": "var(--wp--preset--color--primary)"
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
  },
  "blocks": {
    "core/file": {
      "elements": {
        "button": {
          "typography": {
            "fontSize": ".8rem"
          }
        }
      }
    }
  }
}