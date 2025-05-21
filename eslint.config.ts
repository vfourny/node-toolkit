import eslintJS from '@eslint/js'
import tsEslint from 'typescript-eslint'
import typescriptEslint, { ConfigWithExtends } from 'typescript-eslint'
import globals from 'globals'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import { Linter } from 'eslint'

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
  rules: {},
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
  rules: {
    'no-console': ['error'],
    'no-debugger': ['error'],
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
    ignores: ['node_modules', 'dist', '.nuxt', 'coverage', '.output'],
  },
)
