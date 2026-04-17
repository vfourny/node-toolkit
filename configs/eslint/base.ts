import eslintJS from '@eslint/js'
import type { Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsoncPlugin from 'eslint-plugin-jsonc'
import perfectionist from 'eslint-plugin-perfectionist'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import typescriptEslint from 'typescript-eslint'

const TS_FILES = ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,vue}']

/**
 * Base ESLint configuration with JS-compatible rules only (no @typescript-eslint rules).
 * @typescript-eslint rules are in typescriptConfigs to avoid conflicts with JSON/other parsers.
 */
export const baseConfig: Linter.Config = {
  name: 'node-toolkit/base',
  plugins: {
    import: importPlugin,
    perfectionist,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
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
    'perfectionist/sort-classes': [
      'error',
      { ignoreCase: true, order: 'asc', type: 'natural' },
    ],
    'perfectionist/sort-interfaces': [
      'error',
      { ignoreCase: true, order: 'asc', type: 'natural' },
    ],
    'perfectionist/sort-objects': [
      'error',
      { ignoreCase: true, order: 'asc', type: 'natural' },
    ],
    'prefer-const': ['error', { destructuring: 'all' }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
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
export const commonIgnores = {
  ignores: [
    'node_modules',
    'dist',
    '.nuxt',
    'coverage',
    '.output',
    'build',
    'package-lock.json',
  ],
} satisfies Linter.Config

/**
 * Allow default exports and relative imports in config files
 */
export const configFilesOverride = {
  files: ['**/*.config.{js,ts}'],
  rules: {
    'import/no-default-export': 'off',
    'no-restricted-imports': 'off',
  },
} satisfies Linter.Config

/**
 * Recommended TypeScript ESLint configs + custom @typescript-eslint rules,
 * all scoped to JS/TS/Vue files to avoid conflicts with JSON/other parsers.
 */
export const typescriptConfigs: Linter.Config[] = typescriptEslint.config({
  extends: [
    eslintJS.configs.recommended,
    ...typescriptEslint.configs.recommended,
    ...typescriptEslint.configs.strict,
    ...typescriptEslint.configs.stylistic,
  ],
  files: TS_FILES,
  rules: {
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
  },
}) as unknown as Linter.Config[]

/**
 * JSON files configuration with sorted keys.
 * Uses jsonc recommended config as base (handles parser + disables conflicting JS rules),
 * then adds sort-keys on top.
 */
export const jsonConfigs: Linter.Config[] = [
  ...(jsoncPlugin.configs[
    'flat/recommended-with-jsonc'
  ] as unknown as Linter.Config[]),
  {
    files: ['**/*.json'],
    name: 'node-toolkit/json-sort',
    rules: {
      'jsonc/sort-keys': [
        'error',
        { order: { type: 'asc' }, pathPattern: '.*' },
      ],
    },
  } satisfies Linter.Config,
]

/**
 * Prettier config (should be last in the config array)
 */
export const prettierConfig = eslintConfigPrettier
