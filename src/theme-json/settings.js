module.exports = {
  "appearanceTools": true,
  "useRootPaddingAwareAlignments": true,
  "color": {
    "custom": false,
    "palette": [
      {
        "slug": "dark",
        "color": "var(--wp--custom--color--dark)",
        "name": "Dark"
      },
      {
        "slug": "light",
        "color": "var(--wp--custom--color--light)",
        "name": "Background"
      },
      {
        "slug": "primary",
        "color": "var(--wp--custom--color--primary)",
        "name": "Primary"
      },
      {
        "slug": "secondary",
        "color": "var(--wp--custom--color--secondary)",
        "name": "Secondary"
      },
      {
        "slug": "grey-100",
        "color": "var(--wp--custom--color--grey-100)",
        "name": "Grey 100"
      },
      {
        "slug": "grey-300",
        "color": "var(--wp--custom--color--grey-300)",
        "name": "Grey 300"
      },
      {
        "slug": "grey-500",
        "color": "var(--wp--custom--color--grey-500)",
        "name": "Grey 500"
      },
      {
        "slug": "grey-700",
        "color": "var(--wp--custom--color--grey-700)",
        "name": "Grey 700"
      }
    ]
  },
  "custom": {
    "color": {
      "grey-100": "#eee",
      "grey-200": "#ccc",
      "grey-300": "#aaa",
      "grey-400": "#999",
      "grey-500": "#888",
      "grey-600": "#777",
      "grey-700": "#555",
      "grey-800": "#333",
      "grey-900": "#111",
      "text": "var(--wp--custom--color--grey-900)",
      "light": "#fff",
      "dark": "#000",
      "primary": "#ffe600",
      "secondary": "var(--wp--custom--color--grey-400)"
    },
    "spacing": {
      "small": "0.8125rem 1.4375rem",
      "medium": "0.9375rem 1.5625rem",
      "large": "clamp(4rem, 10vw, 8rem)",
      "outer": "var(--wp--custom--spacing--small, 1.25rem)"
    },
    "typography": {
      "line-height": {
        "tiny": 1.15,
        "small": 1.2,
        "medium": 1.4,
        "normal": 1.6
      }
    }
  },
  "spacing": {
    "blockGap": true,
    "customSpacingSize": false,
    "units": [
      "%",
      "px",
      "em",
      "rem",
      "vh",
      "vw"
    ]
  },
  "typography": {
    "customFontSize": false,
    "fluid": true,
    "fontFamilies": [
      {
        "fontFamily": "\"Poppins\", sans-serif",
        "name": "Poppins",
        "slug": "primary",
        "fontFace": [
          {
            "fontFamily": "Poppins",
            "fontWeight": "400",
            "fontStyle": "normal",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-Regular.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "400",
            "fontStyle": "italic",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-Italic.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "300",
            "fontStyle": "normal",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-Light.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "300",
            "fontStyle": "italic",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-LightItalic.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "500",
            "fontStyle": "normal",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-Medium.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "500",
            "fontStyle": "italic",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-MediumItalic.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "700",
            "fontStyle": "normal",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-Bold.woff2" ]
          },
          {
            "fontFamily": "Poppins",
            "fontWeight": "700",
            "fontStyle": "italic",
            "fontStretch": "normal",
            "src": [ "file:./assets/fonts/Poppins-BoldItalic.woff2" ]
          }
        ]
      }
    ],
    "fontSizes": [
      {
        "size": "0.75rem",
        "slug": "x-small",
        "name": "Très petit"
      },
      {
        "size": "1rem",
        "slug": "small",
        "name": "Petit"
      },
      {
        "size": "1.125rem",
        "slug": "medium",
        "name": "Texte / H6"
      },
      {
        "size": "1.5rem",
        "slug": "large",
        "name": "H5"
      },
      {
        "size": "clamp(1.625rem, 2vw + 1rem, 2rem);",
        "slug": "x-large",
        "name": "H4"
      },
      {
        "size": "clamp(2.125rem, 2vw + 1rem, 2.25rem);",
        "slug": "huge",
        "name": "H3"
      },
      {
        "size": "clamp(2.375rem, 3vw + 1rem, 3rem);",
        "slug": "gigantic",
        "name": "H2"
      },
      {
        "size": "clamp(2.5rem, 3vw + 1rem, 3.5rem);",
        "slug": "colossal",
        "name": "H1"
      }
    ]
  },
  "layout": {
    "contentSize": "760px",
    "wideSize": "1160px"
  }
}