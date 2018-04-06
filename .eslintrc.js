module.exports = {
  "extends": [
    "standard",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "semi": [2, "never"],
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 120,
        "semi": false
      }
    ],
  },
  "plugins": [
    "prettier"
  ]
};