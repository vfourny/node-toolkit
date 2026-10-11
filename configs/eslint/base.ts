import eslintJS from '@eslint/js'
import type { Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importPlugin from 'eslint-plugin-import-x'
import jsoncPlugin from 'eslint-plugin-jsonc'
import perfectionist from 'eslint-plugin-perfectionist'
import typescriptEslint from 'typescript-eslint'

const TS_FILES = ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,vue}']

const SORT_OPTIONS = {
  ignoreCase: true,
  order: 'asc',
  type: 'natural',
} as const

/**
 * Base ESLint configuration with JS-compatible rules only (no @typescript-eslint rules).
 * @typescript-eslint rules are in typescriptConfigs to avoid conflicts with JSON/other parsers.
 *
 * eslint-plugin-import-x is registered under the `import` namespace
 * (same as @nuxt/eslint), so rules are named `import/*`.
 */
export const baseConfig: Linter.Config = {
  name: 'node-toolkit/base',
  plugins: {
    import: importPlugin as unknown as NonNullable<
      Linter.Config['plugins']
    >[string],
    perfectionist,
  },
  rules: {
    // General JavaScript/TypeScript rules
    eqeqeq: ['error', 'always'],

    // Import plugin rules
    'import/no-default-export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-namespace': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-const-assign': 'error',
    'no-debugger': 'error',
    // Parent imports must go through an alias (@/, #/, ~/); sibling imports are allowed
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*', '..'],
            message:
              'Parent relative imports are not allowed. Use an import alias instead (e.g. @/ or #/).',
          },
        ],
      },
    ],

    'no-throw-literal': 'error',
    'no-unused-expressions': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'perfectionist/sort-classes': ['error', SORT_OPTIONS],
    'perfectionist/sort-exports': ['error', SORT_OPTIONS],
    'perfectionist/sort-imports': [
      'error',
      {
        ...SORT_OPTIONS,
        groups: [
          'side-effect',
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'unknown',
        ],
        internalPattern: ['^[@#~]/.+'],
      },
    ],
    'perfectionist/sort-interfaces': ['error', SORT_OPTIONS],
    'perfectionist/sort-named-exports': ['error', SORT_OPTIONS],
    'perfectionist/sort-named-imports': ['error', SORT_OPTIONS],
    'prefer-const': ['error', { destructuring: 'all' }],
    'sort-imports': 'off',
    'sort-keys': 'off',
  },
  settings: {
    'import-x/resolver-next': [
      createTypeScriptImportResolver({ alwaysTryTypes: true }),
    ],
  },
}

/**
 * Toolkit Vue rules, without plugin setup.
 * Shared by the Vue config and the Nuxt config (where @nuxt/eslint registers the plugin)
 */
export const vueRules = {
  'vue/attributes-order': ['error', { alphabetical: true }],
  'vue/component-name-in-template-casing': [
    'error',
    'PascalCase',
    {
      registeredComponentsOnly: false,
    },
  ],
  'vue/order-in-components': 'off',
} satisfies Linter.RulesRecord

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
  files: ['**/*.config.{js,mjs,cjs,ts,mts,cts}'],
  rules: {
    'import/no-default-export': 'off',
    // Config files often import generated defaults (e.g. withNuxt)
    'import/no-named-as-default': 'off',
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
      // PascalCase allowed for components (React, Vue render functions)
      { format: ['camelCase', 'PascalCase'], selector: 'function' },
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
 * Opt-in type-aware rules (no-floating-promises, no-misused-promises, await-thenable,
 * no-unsafe-*, switch-exhaustiveness-check, ...) for TypeScript files.
 * Slower than syntax-only linting: each file is type checked through the TypeScript project service.
 *
 * @param tsconfigRootDir - Directory containing the project tsconfig (usually `import.meta.dirname`)
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import { createTypeCheckedConfigs } from '@vfourny/node-toolkit/eslint/base'
 * import nodeConfig from '@vfourny/node-toolkit/eslint/node'
 *
 * export default [...nodeConfig, ...createTypeCheckedConfigs(import.meta.dirname)]
 * ```
 */
export const createTypeCheckedConfigs = (
  tsconfigRootDir: string,
): Linter.Config[] =>
  typescriptEslint.config({
    extends: [...typescriptEslint.configs.recommendedTypeCheckedOnly],
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
    name: 'node-toolkit/type-checked',
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
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
    // Keep the conventional/semantic key order of these files
    ignores: ['**/package.json', '**/tsconfig*.json', '**/jsconfig*.json'],
    name: 'node-toolkit/json-sort',
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          order: { type: 'asc' },
          pathPattern: '^((?!exports).)*$',
        },
      ],
    },
  } satisfies Linter.Config,
]

/**
 * Prettier config (should be last in the config array)
 */
export const prettierConfig = eslintConfigPrettier
