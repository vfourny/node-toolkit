/**
 * Base Vitest configuration for Node.js projects
 *
 * This configuration provides sensible defaults for testing Node.js applications:
 * - Node environment
 * - Global test APIs (describe, it, expect, etc.)
 * - Coverage with V8 provider
 * - Text, JSON, and HTML coverage reports
 *
 * @example
 * ```typescript
 * // vitest.config.ts
 * import { defineConfig, mergeConfig } from 'vitest/config'
 * import baseConfig from '@vfourny/node-toolkit/vitest'
 *
 * export default mergeConfig(
 *   baseConfig,
 *   defineConfig({
 *     test: {
 *       include: ['tests/**\/*.test.ts'],
 *     },
 *   })
 * )
 * ```
 */
const config = {
  test: {
    reporters: ['default'],
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      clean: true,
    },
  },
}

export default config
