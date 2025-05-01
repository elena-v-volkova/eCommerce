import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParserTypescript from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import css from 'eslint-plugin-css';
import stylistic from '@stylistic/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '.config/',
      'vite.config.ts',
      'tsconfig.json',
      'node_modules',
      '*.config.mjs',
      '*.config.ts',
      'commitlint.config.mjs',
    ],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: eslintParserTypescript,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': a11y,
      import: importPlugin,
      prettier,
      css,
      '@stylistic': stylistic,
      unicorn,
    },
    rules: {
      'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'max-lines-per-function': ['error', 40],
      'no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          enforceConst: true,
        },
      ],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ],
      'import/prefer-default-export': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-absolute-path': 'error',
      '@stylistic/line-comment-position': [
        'warn',
        {
          position: 'beside',
          ignorePattern: '\\s*#(endregion|region)',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
      },
    },
  },
  {
    files: ['src/vite-env.d.ts'],
    rules: {
      '@stylistic/line-comment-position': 'off',
    },
  },
  {
    files: ['vite.config.ts', '*.config.ts', '*.config.mjs'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-cycle': 'off',
      'import/no-duplicates': 'off',
      'import/order': 'off',
      'import/no-self-import': 'off',
      'import/no-relative-packages': 'off',
      'import/no-named-as-default': 'off',
    },
  },

  {
    files: [
      '**/*.test.[jt]s',
      '**/*.spec.[jt]s',
      '**/tests/**/*.[jt]s',
      '*.config.mjs',
    ],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
];
