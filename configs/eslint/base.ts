import eslintJS from '@eslint/js'
import type { Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
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
    'simple-import-sort': simpleImportSort,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    // General JavaScript/TypeScript rules
    eqeqeq: ['error', 'always'],
    'prefer-const': ['error', { destructuring: 'all' }],
    'no-useless-rename': 'error',
    'no-useless-constructor': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-var': 'error',
    'no-redeclare': 'error',
    'no-const-assign': 'error',

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

    // Disable default sort-imports in favor of simple-import-sort
    'sort-imports': 'off',

    // TypeScript-specific rules
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'import',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      { selector: 'class', format: ['PascalCase'] },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
      },
      { selector: 'enum', format: ['PascalCase'] },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      {
        ignoreParameters: true,
        ignoreProperties: true,
      },
    ],
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',

    // Import plugin rules
    'import/no-default-export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-namespace': 'error',

    // Import sorting
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}

/**
 * Common ignores for all project types
 */
export const commonIgnores: Linter.Config = {
  ignores: ['node_modules', 'dist', '.nuxt', 'coverage', '.output', 'build'],
}

/**
 * Allow default exports in config files
 */
export const configFilesOverride: Linter.Config = {
  files: ['*.config.{js,ts}'],
  rules: { 'import/no-default-export': 'off' },
}

/**
 * Recommended TypeScript ESLint configs
 */
export const typescriptConfigs = [
  eslintJS.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...typescriptEslint.configs.strict,
  ...typescriptEslint.configs.stylistic,
]

/**
 * Prettier config (should be last in the config array)
 */
export const prettierConfig = eslintConfigPrettier
