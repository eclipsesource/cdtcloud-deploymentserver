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
    'license-header/header': ['error', 'license-header.js'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/parser': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    'array-callback-return': 'off',
    'no-useless-escape' : 'off'
  }
}
