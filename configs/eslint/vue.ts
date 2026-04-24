import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint, { type ConfigWithExtends } from 'typescript-eslint'

import {
  baseConfig,
  commonIgnores,
  configFilesOverride,
  jsonConfigs,
  prettierConfig,
  typescriptConfigs,
} from './base.js'
import { nodeGlobalsConfig } from './node.js'

/**
 * Vue-specific configuration
 * Uses ConfigWithExtends to support the 'extends' property for Vue's recommended rules
 * Exported for reuse in other configs (Nuxt, etc.)
 */
export const vueFilesConfig: ConfigWithExtends = {
  extends: [...eslintPluginVue.configs['flat/recommended']],
  files: ['**/*.vue'],
  languageOptions: {
    ecmaVersion: 'latest',
    globals: globals.browser,
    parserOptions: {
      parser: typescriptEslint.parser,
    },
    sourceType: 'module',
  },
  name: 'node-toolkit/vue',
  rules: {
    'vue/attributes-order': ['error', { alphabetical: true }],

    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
      },
    ],
    'vue/order-in-components': 'off',
  },
} satisfies ConfigWithExtends

/**
 * Complete ESLint configuration for Vue projects
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import vueConfig from '@vfourny/node-toolkit/eslint/vue'
 *
 * export default vueConfig
 * ```
 */
export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  vueFilesConfig,
  ...jsonConfigs,
  prettierConfig,
  configFilesOverride,
  commonIgnores,
)
