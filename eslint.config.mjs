import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettier,
  {
    ignores: ['client/**', 'server/**', 'shared/**', 'node_modules/**', 'dist/**'],
  },
];
