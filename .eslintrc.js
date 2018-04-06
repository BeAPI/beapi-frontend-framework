export default {
  "extends": [
    "standard",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 120,
      }
    ],
  },
  "plugins": [
    "prettier"
  ]
};