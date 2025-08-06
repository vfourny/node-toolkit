import eslintJS from '@eslint/js'
import type { Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import typescriptEslint, { type ConfigWithExtends } from 'typescript-eslint'

const vueFilesConfig: ConfigWithExtends = {
  name: 'eslint-config-node-tools/vue',
  extends: [...eslintPluginVue.configs['flat/recommended']],
  files: ['**/*.{ts,vue}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: globals.browser,
    parserOptions: {
      parser: typescriptEslint.parser,
    },
  },
  rules: {
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
      },
    ],
  },
}

const defaultConfig: Linter.Config = {
  name: 'eslint-config-node-tools/default',
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {},
}

const customConfig: Linter.Config = {
  name: 'eslint-config-node-tools/custom-config',
  plugins: {
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
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
    'sort-imports': 'off',

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
        format: ['camelCase', 'UPPER_CASE'],
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

    'import/no-default-export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-namespace': 'error',

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}

export default tsEslint.config(
  eslintJS.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.strict,
  tsEslint.configs.stylistic,
  vueFilesConfig,
  defaultConfig,
  customConfig,
  eslintConfigPrettier,
  {
    files: ['*.config.{js,ts}'],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    ignores: ['node_modules', 'dist', '.nuxt', 'coverage', '.output'],
  },
)
