module.exports = {
  root: true,
  extends: ['standard-with-typescript', 'standard-jsx', 'standard-react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  }
}
