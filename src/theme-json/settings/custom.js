// See https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#custom

module.exports = {
  "color": {
    "grey-100": "#F3F5F7",
    "grey-500": "#C2D0D9",
    "grey-700": "#4A5B65",
    "grey-900": "#1E1E1E",
    "text": "var(--wp--custom--color--grey-700)",
    "light": "#fff",
    "dark": "#1E1E1E",
    "primary": "#FFE600",
    "secondary": "var(--wp--custom--color--dark)"
  },
  "spacing": {
    "xxsmall": "0.25rem", // 4px
    "xsmall": "0.5rem", // 8px
    "small": "1rem", // 16px
    "medium": "1.5rem", // 24px
    "large": "2rem", // 32px
    "xlarge": "3rem", // 48px
    "xxlarge": "4rem"// 64px
  },
  "typography": {
    "size": {
      "xs": "0.75rem",  // 12px
      "s": "1rem",      // 16px
      "m": "1.125rem",  // 18px h5/h6
      "l": "1.25rem",   // 20px h4
      "xl": "1.5rem",   // 24px h3
      "xxl": "clamp(2rem, 1.8239rem + 0.7512vw, 2.5rem)",     // 32px to 40px h2
      "huge": "clamp(2.5rem, 1.9718rem + 2.2535vw, 4rem)",    // 40px to 64px 
      "gigantic": "clamp(3rem, 2.2958rem + 3.0047vw, 5rem);", // 48px to 80px h1
      "colossal": "clamp(4rem, 2.5915rem + 6.0094vw, 8rem);"  // 64px to 128px
    },
    "line-height": {
      "tiny": 1.1,
      "small": 1.2,
      "medium": 1.25,
      "normal": 1.5
    }
  }
}