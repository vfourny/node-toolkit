import type { Linter } from 'eslint'
import eslintPluginAstro from 'eslint-plugin-astro'
import typescriptEslint from 'typescript-eslint'

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
 * Astro recommended configuration
 * Sets up astro-eslint-parser for .astro files, with typescript-eslint
 * as the parser for frontmatter and <script> tags
 * Exported for reuse in custom compositions
 */
export const astroConfigs = eslintPluginAstro.configs[
  'flat/recommended'
] as Linter.Config[]

/**
 * TypeScript rules applied to .astro files (frontmatter included).
 * Must come before astroConfigs so astro-eslint-parser stays the active parser.
 */
const astroTypescriptConfigs: Linter.Config[] = typescriptConfigs.map(
  (config) => ({ ...config, files: ['**/*.astro'] }),
)

const astroIgnores = {
  ignores: ['.astro'],
} satisfies Linter.Config

/**
 * Complete ESLint configuration for Astro projects
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import astroConfig from '@vfourny/node-toolkit/eslint/astro'
 *
 * export default astroConfig
 * ```
 */
export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  ...astroTypescriptConfigs,
  ...astroConfigs,
  ...jsonConfigs,
  prettierConfig,
  configFilesOverride,
  commonIgnores,
  astroIgnores,
)
