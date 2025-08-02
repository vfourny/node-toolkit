import eslintJS from '@eslint/js'
import { Linter } from 'eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import typescriptEslint, { ConfigWithExtends } from 'typescript-eslint'

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
    'no-console': 'error',
    'no-debugger': 'error',
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
