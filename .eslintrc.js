module.exports = {
  root: true,

  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  endOfLine: 'auto',
};
