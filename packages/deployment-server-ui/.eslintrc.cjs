module.exports = {
  root: true,
  extends: 'standard-with-typescript',
  env: {
    node: true
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  plugins: [
    'header'
  ],
  rules: {
    'header/header': [2, 'license-header.js']
  }
}
