module.exports = {
  root: true,
  extends: ['standard-with-typescript', 'standard-jsx', 'standard-react', 'plugin:react/jsx-runtime'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
}
