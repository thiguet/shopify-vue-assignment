const isDevelopment = process.env.NODE_ENV === "development"

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended", // use 'plugin:vue/vue3-essential' for less strict linting rules - https://eslint.vuejs.org/rules
  ],
  plugins: ["vue", "@typescript-eslint"],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  globals: {
    Shopify: "readonly",
    defineSlots: "readonly",
  },
  ignorePatterns: [
    /**
     * ignore certain files
     * docs: https://eslint.org/docs/user-guide/configuring#ignorepatterns-in-config-files
     */
    // 'my-file.js',
    // '**/my-directory/*.js'
  ],
  rules: {
    /**
     * add custom rules
     * docs: https://eslint.org/docs/rules
     */
    "no-unused-vars": isDevelopment ? "off" : "error",
    // 'quotes': ['error', 'single'],
    // 'semi': ['error', 'never']
    "vue/multi-word-component-names": "off",
    "vue/object-curly-spacing": [2, "always"],
    "vue/html-closing-bracket-spacing": [
      2,
      {
        selfClosingTag: "always",
      },
    ],
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    semi: [2, "never"],
  },
}
