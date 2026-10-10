import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
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
 * React-specific configuration for JSX/TSX files
 * Uses the automatic JSX runtime (no need to import React in scope)
 * Exported for reuse in other configs (Next, etc.)
 */
export const reactFilesConfig: ConfigWithExtends = {
  extends: [
    eslintPluginReact.configs.flat.recommended,
    eslintPluginReact.configs.flat['jsx-runtime'],
  ],
  files: ['**/*.{jsx,tsx}'],
  languageOptions: {
    globals: globals.browser,
  },
  name: 'node-toolkit/react',
  rules: {
    'react/jsx-sort-props': ['error', { ignoreCase: true }],
    // Props are typed with TypeScript
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
} satisfies ConfigWithExtends

/**
 * Rules of Hooks, also applied to plain JS/TS files to cover custom hooks
 * Exported for reuse in other configs (Next, etc.)
 */
export const reactHooksConfig: ConfigWithExtends = {
  extends: [eslintPluginReactHooks.configs.flat.recommended],
  files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  name: 'node-toolkit/react-hooks',
} satisfies ConfigWithExtends

/**
 * Complete ESLint configuration for React projects
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import reactConfig from '@vfourny/node-toolkit/eslint/react'
 *
 * export default reactConfig
 * ```
 */
export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  reactFilesConfig,
  reactHooksConfig,
  ...jsonConfigs,
  prettierConfig,
  configFilesOverride,
  commonIgnores,
)
