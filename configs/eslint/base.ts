import eslintJS from '@eslint/js'
import type { Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import typescriptEslint from 'typescript-eslint'

/**
 * Base ESLint configuration with TypeScript, import rules, and formatting
 * This config is meant to be extended by specific project type configurations
 */
export const baseConfig: Linter.Config = {
  name: 'node-toolkit/base',
  plugins: {
    import: importPlugin,
    perfectionist,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],

    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        selector: 'import',
      },
      { format: ['PascalCase'], selector: 'class' },
      {
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        modifiers: ['const'],
        selector: 'variable',
      },
      {
        format: ['PascalCase'],
        selector: 'typeParameter',
      },
      { format: ['PascalCase'], selector: 'enum' },
    ],

    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],

    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true,
        ignoreProperties: true,
      },
    ],

    '@typescript-eslint/no-unsafe-declaration-merging': 'error',

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    '@typescript-eslint/no-use-before-define': 'error',

    // General JavaScript/TypeScript rules
    eqeqeq: ['error', 'always'],

    // Import plugin rules
    'import/no-default-export': 'error',

    'import/no-named-as-default': 'error',

    'import/no-named-as-default-member': 'error',

    'import/no-namespace': 'error',

    'no-console': 'error',

    'no-const-assign': 'error',

    'no-debugger': 'error',

    // Enforce absolute imports with @/ prefix
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*', './*'],
            message:
              'Relative imports are not allowed. Use absolute imports instead with @/.',
          },
        ],
      },
    ],

    'no-throw-literal': 'error',

    'no-unused-expressions': 'error',

    'no-useless-constructor': 'error',

    'no-useless-rename': 'error',

    'no-var': 'error',

    // Enforce alphabetical ordering of class members (auto-fixable)
    'perfectionist/sort-classes': [
      'error',
      { ignoreCase: true, order: 'asc', type: 'natural' },
    ],

    // Enforce alphabetical ordering of interface/type keys (auto-fixable)
    'perfectionist/sort-interfaces': [
      'error',
      { ignoreCase: true, order: 'asc', type: 'natural' },
    ],

    // Enforce alphabetical ordering of object keys (auto-fixable)
    'perfectionist/sort-objects': [
      'error',
      { ignoreCase: true, order: 'asc', type: 'natural' },
    ],

    'prefer-const': ['error', { destructuring: 'all' }],

    'simple-import-sort/exports': 'error',

    // Import sorting
    'simple-import-sort/imports': 'error',

    // Disable default sort-imports in favor of simple-import-sort
    'sort-imports': 'off',
    'sort-keys': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
}

/**
 * Common ignores for all project types
 */
export const commonIgnores: Linter.Config = {
  ignores: ['node_modules', 'dist', '.nuxt', 'coverage', '.output', 'build'],
}

/**
 * Allow default exports and relative imports in config files
 */
export const configFilesOverride: Linter.Config = {
  files: ['**/*.config.{js,ts}'],
  rules: {
    'import/no-default-export': 'off',
    'no-restricted-imports': 'off',
  },
}

/**
 * Recommended TypeScript ESLint configs
 */
export const typescriptConfigs: Linter.Config[] = [
  eslintJS.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...typescriptEslint.configs.strict,
  ...typescriptEslint.configs.stylistic,
]

/**
 * Prettier config (should be last in the config array)
 */
export const prettierConfig = eslintConfigPrettier
