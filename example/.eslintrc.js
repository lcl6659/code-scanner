module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    parser: 'babel-eslint',
  },
  rules: {
    'prefer-template': 2,
    'no-alert': 2,
    'no-console': 0,
    'no-unused-vars': 0,
    quotes: ['error', 'single'],
  },
}
