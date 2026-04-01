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
      coverage: {
        exclude: [
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/types/**/*.ts',
          'src/**/*.d.ts',
          'src/**/index.ts',
        ],
        include: ['src/**/*.ts'],
        thresholds: { 100: true },
      },
      include: ['tests/**/*.test.ts'],
    },
  }),
)
