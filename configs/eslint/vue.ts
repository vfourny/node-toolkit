import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint, { type ConfigWithExtends } from 'typescript-eslint'

import {
  baseConfig,
  commonIgnores,
  configFilesOverride,
  prettierConfig,
  typescriptConfigs,
} from './base'
import { nodeGlobalsConfig } from './node'

/**
 * Vue-specific configuration
 * Uses ConfigWithExtends to support the 'extends' property for Vue's recommended rules
 * Exported for reuse in other configs (Nuxt, etc.)
 */
export const vueFilesConfig: ConfigWithExtends = {
  name: 'node-toolkit/vue',
  extends: [...eslintPluginVue.configs['flat/recommended']],
  files: ['**/*.vue'],
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
  prettierConfig,
  configFilesOverride,
  commonIgnores,
)
