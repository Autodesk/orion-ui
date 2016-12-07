module.exports = {
  "extends": "eslint-config-airbnb",
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "arrow-body-style": "off"
  }
}
