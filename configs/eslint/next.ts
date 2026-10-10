import eslintPluginNext from '@next/eslint-plugin-next'
import type { Linter } from 'eslint'
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
import { reactFilesConfig, reactHooksConfig } from './react.js'

/**
 * Next.js plugin rules (recommended + Core Web Vitals)
 */
const nextConfig = {
  files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  name: 'node-toolkit/next',
  plugins: {
    '@next/next': eslintPluginNext,
  },
  rules: {
    ...eslintPluginNext.configs.recommended.rules,
    ...eslintPluginNext.configs['core-web-vitals'].rules,
    // Pages Router only, and warns on every run when no pages/ directory exists
    '@next/next/no-html-link-for-pages': 'off',
  },
} satisfies Linter.Config

/**
 * Next.js requires default exports in its file conventions
 * (App Router special files, Pages Router, middleware/proxy, metadata files)
 */
const nextDefaultExportsOverride = {
  files: [
    '**/app/**/{page,layout,template,loading,error,global-error,not-found,forbidden,unauthorized,default}.{js,jsx,ts,tsx}',
    '**/app/**/{opengraph-image,twitter-image,icon,apple-icon,sitemap,robots,manifest}.{js,jsx,ts,tsx}',
    '**/pages/**/*.{js,jsx,ts,tsx}',
    '**/{middleware,proxy,instrumentation}.{js,ts}',
  ],
  name: 'node-toolkit/next-default-exports',
  rules: {
    'import/no-default-export': 'off',
  },
} satisfies Linter.Config

const nextIgnores = {
  ignores: ['.next', 'out', 'next-env.d.ts'],
} satisfies Linter.Config

/**
 * Complete ESLint configuration for Next.js projects
 *
 * Includes the React configuration plus the Next.js plugin rules.
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import nextConfig from '@vfourny/node-toolkit/eslint/next'
 *
 * export default nextConfig
 * ```
 */
export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  reactFilesConfig,
  reactHooksConfig,
  nextConfig,
  ...jsonConfigs,
  prettierConfig,
  configFilesOverride,
  nextDefaultExportsOverride,
  commonIgnores,
  nextIgnores,
)
