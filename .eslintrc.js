// http://eslint.org/docs/user-guide/configuring
const path = require("path");

module.exports = {
  extends: ["airbnb"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    useJSXTextNode: true
  },
  plugins: ["@typescript-eslint"],
  env: {
    browser: true
  },
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "no-param-reassign": "off",
    "no-unused-vars": "off",
    "no-underscore-dangle": "off",
    "generator-star-spacing": "off",
    "import/no-extraneous-dependencies": "off",
    "array-callback-return": "off",
    "no-confusing-arrow": "off",
    "consistent-return": "off",
    "no-debugger": "warn",
    "no-plusplus": "off",
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "ignore"
      }
    ],
    "object-curly-newline": "off",
    "operator-linebreak": "off",
    "import/prefer-default-export": "off",
    "implicit-arrow-linebreak": "off",
    "import/no-unresolved": "off"
  }
};
