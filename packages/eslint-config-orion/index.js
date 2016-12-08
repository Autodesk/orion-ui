module.exports = {
  "extends": "eslint-config-airbnb",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "arrow-body-style": "off",
    "react/jsx-filename-extension": "off",
    "no-console": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.js"]}]
  }
}
