// .eslintrc.cjs
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: ['@ferlab'],
  rules: {
    'react-hooks/exhaustive-deps': 'off', // disable missing deps warnings
    'react/display-name': 'off', // disables missing display name warnings
    'max-len': [
      'warn', // or 'error'
      {
        code: 130, // maximum line length
        ignoreComments: true,
        ignoreStrings: true, // ignore long strings
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: 'className="[^"]+"', // ignore lines containing className=""
      },
    ],
  },
});
