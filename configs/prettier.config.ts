import type { Config } from 'prettier'

/**
 * Base Prettier configuration
 *
 * Opinionated formatting rules for consistent code style:
 * - Single quotes
 * - No semicolons
 * - Trailing commas
 * - 80 character line width
 * - LF line endings
 *
 * @example
 * ```javascript
 * // prettier.config.js
 * export { default } from '@vfourny/node-toolkit/prettier'
 * ```
 *
 * Or with customization:
 * ```javascript
 * // prettier.config.js
 * import baseConfig from '@vfourny/node-toolkit/prettier'
 *
 * export default {
 *   ...baseConfig,
 *   printWidth: 100,
 * }
 * ```
 */
const config: Config = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
}

export default config
