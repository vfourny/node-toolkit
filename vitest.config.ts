import path from 'node:path'

import { defineConfig, mergeConfig } from 'vitest/config'

import baseConfig from './configs/vitest.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      include: ['tests/**/*.test.ts'],
      coverage: {
        thresholds: { 100: true },
        include: ['src/**/*.ts'],
        exclude: [
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/types/**/*.ts',
          'src/**/*.d.ts',
          'src/**/index.ts',
        ],
      },
    },
  }),
)
