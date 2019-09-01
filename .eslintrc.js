module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    browser: true,
    es6: true
  },
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'semi': false,
        'singleQuote': true
      }
    ]
  }
}
