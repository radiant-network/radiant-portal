// .eslintrc.cjs
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  extends: ['@ferlab'],
  rules: {
    'react-hooks/exhaustive-deps': 'off', // disable missing deps warnings
    'react/display-name': 'off', // disables missing display name warnings
    'no-nested-ternary': 'error', // disallow nested ternaries
    'no-unneeded-ternary': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    // required by verbatimModuleSyntax: a type imported without the `type`
    // keyword is kept in the bundle and breaks at runtime
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    // with verbatimModuleSyntax, `import { type A } from 'x'` still emits
    // `import {} from 'x'` and keeps a useless runtime dependency
    '@typescript-eslint/no-import-type-side-effects': 'error',
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
