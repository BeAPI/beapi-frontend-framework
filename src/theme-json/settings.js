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
      "block-1": "clamp(1rem, 0.6479rem + 1.5023vw, 2rem)", // 16 to 32px
      "block-2": "clamp(2rem, 1.2958rem + 3.0047vw, 4rem)", // 32 to 64px
      "block-3": "clamp(3rem, 1.9437rem + 4.5070vw, 6rem)", // 48 to 96px
      "block-4": "clamp(4rem, 2.5915rem + 6.0094vw, 8rem)", // 64 to 128px
      "small": "0.8125rem 1.4375rem",
      "medium": "0.9375rem 1.5625rem"
    },
    "typography": {
      "font-size": {
        "x-small": "0.75rem",
        "small": "1rem",
        "h-6": "1.125rem",
        "h-5": "1.5rem",
        "h-4": "clamp(1.625rem, 2vw + 1rem, 2rem)",
        "h-3": "clamp(2.125rem, 2vw + 1rem, 2.25rem)",
        "h-2": "clamp(2.375rem, 3vw + 1rem, 2.875rem)",
        "h-1": "clamp(2.875rem, 3vw + 1rem, 3.5rem)"
      },
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
        "size": "var(--wp--custom--typography--font-size--x-small)",
        "slug": "x-small",
        "name": "Très petit"
      },
      {
        "size": "var(--wp--custom--typography--font-size--small)",
        "slug": "small",
        "name": "Petit"
      },
      {
        "size": "var(--wp--custom--typography--font-size--h-6)",
        "slug": "medium",
        "name": "H6"
      },
      {
        "size": "var(--wp--custom--typography--font-size--h-5)",
        "slug": "large",
        "name": "H5"
      },
      {
        "size": "var(--wp--custom--typography--font-size--h-4)",
        "slug": "x-large",
        "name": "H4"
      },
      {
        "size": "var(--wp--custom--typography--font-size--h-3)",
        "slug": "huge",
        "name": "H3"
      },
      {
        "size": "var(--wp--custom--typography--font-size--h-2)",
        "slug": "gigantic",
        "name": "H2"
      },
      {
        "size": "var(--wp--custom--typography--font-size--h-1)",
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