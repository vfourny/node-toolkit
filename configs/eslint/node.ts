import type { Linter } from 'eslint'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

import {
  baseConfig,
  commonIgnores,
  configFilesOverride,
  jsonConfigs,
  prettierConfig,
  typescriptConfigs,
} from './base.js'

/**
 * Node.js-specific configuration with Node.js globals
 * Exported for reuse in other configs (Vue, Nuxt, etc.)
 */
export const nodeGlobalsConfig = {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  name: 'node-toolkit/node-globals',
} satisfies Linter.Config

/**
 * Complete ESLint configuration for Node.js projects
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import nodeConfig from '@vfourny/node-toolkit/eslint/node'
 *
 * export default nodeConfig
 * ```
 */
export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  ...jsonConfigs,
  prettierConfig,
  configFilesOverride,
  commonIgnores,
)
