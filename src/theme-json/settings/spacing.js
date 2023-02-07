module.exports = {
  "blockGap": true,
  "customSpacingSize": false,
  "units": [
    "%",
    "px",
    "em",
    "rem",
    "vh",
    "vw"
  ],
  "spacingSizes": [
    {
      "slug": "8",
      "size": "clamp(0.25rem, 0.1620rem + 0.3756vw, 0.5rem)", // 4 to 8px
      "name": "X Small (8px)",
      "fluid": true
    },
    {
      "slug": "16",
      "size": "clamp(0.5rem, 0.3239rem + 0.7512vw, 1rem)", // 8 to 16px
      "name": "Small (16px)",
      "fluid": true
    },
    {
      "slug": "32",
      "size": "clamp(1rem, 0.6479rem + 1.5023vw, 2rem)", // 16 to 32px
      "name": "Regular (32px)",
      "fluid": true
    },
    {
      "slug": "48",
      "size": "clamp(2rem, 1.6479rem + 1.5023vw, 3rem)", // 32 to 48px
      "name": "Large (48px)",
      "fluid": true
    },
    {
      "slug": "64",
      "size": "clamp(3rem, 2.6479rem + 1.5023vw, 4rem)", // 48 to 64px
      "name": "X Large (64px)",
      "fluid": true
    }
  ]
}