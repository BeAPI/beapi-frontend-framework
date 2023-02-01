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
  "elements": {
    "heading": {
      "typography": {
        "fontWeight": "400"
      }
    },
    "h1": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
        "fontSize": "var(--wp--custom--typography--font-size--h-1)"
      }
    },
    "h2": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--small)",
        "fontSize": "var(--wp--custom--typography--font-size--h-2)"
      }
    },
    "h3": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
        "fontSize": "var(--wp--custom--typography--font-size--h-3)"
      }
    },
    "h4": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--tiny)",
        "fontSize": "var(--wp--custom--typography--font-size--h-4)"
      }
    },
    "h5": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--normal)",
        "fontSize": "var(--wp--custom--typography--font-size--h-5)"
      }
    },
    "h6": {
      "typography": {
        "lineHeight": "var(--wp--custom--typography--line-height--normal)",
        "fontSize": "var(--wp--custom--typography--font-size--h-6)"
      }
    },
    "link": {
      "color": {
        "text": "var(--wp--custom--color--dark)"
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
        "background": "var(--wp--custom--color--primary)",
        "text": "var(--wp--custom--color--dark)"
      },
      "typography": {
        "fontSize": "var(--wp--custom--typography--font-size--x-small)",
        "fontWeight": "700",
        "lineHeight": "1"
      },
      ":hover": {
        "color": {
          "background": "var(--wp--custom--color--dark)",
          "text": "var(--wp--custom--color--primary)"
        }
      }
    },
    "caption": {
      "typography": {
        "fontSize": "var(--wp--custom--typography--font-size--x-small)"
      },
      "color": {
        "text": "var(--wp--custom--color--grey-700)"
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