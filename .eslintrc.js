module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
    'plugin:prettier/recommended',
    'plugin:react-native/all',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['@react-native-community', 'prettier', 'react', 'react-native', 'react-hooks'],
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-color-literals': 2,
    'react-native/no-inline-styles': 0,
    'react-native/no-raw-text': 0,
    'react-native/no-single-element-style-arrays': 0,
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    'react-native/react-native': true
  }
};
