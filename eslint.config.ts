/**
 * ESLint configuration for this project (node-toolkit itself)
 * Uses the Node.js configuration from our own configs
 */
import type { Linter } from 'eslint'
import typescriptEslint from 'typescript-eslint'

import nodeConfig from './configs/eslint/node'

/**
 * Override for the configs folder and root config - allow relative imports and default exports
 * since these are internal config files that need to use ESLint's standard patterns
 */
const configsOverride: Linter.Config = {
  files: ['configs/**/*.{ts,js}', 'eslint.config.ts'],
  rules: {
    'no-restricted-imports': 'off',
    'import/no-default-export': 'off',
  },
}

export default typescriptEslint.config(...nodeConfig, configsOverride)
