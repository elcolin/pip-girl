// @ts-check
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', '.astro/**'] },
  js.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
      globals: { ...globals.browser },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['*.config.{js,mjs,ts}', 'tests/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
