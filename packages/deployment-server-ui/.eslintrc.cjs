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
    'license-header'
  ],
  rules: {
    'license-header/header': ['error', 'license-header.js'],
  }
}
