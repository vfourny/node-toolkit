import type { Linter } from 'eslint'
import typescriptEslint from 'typescript-eslint'

import {
  baseConfig,
  commonIgnores,
  configFilesOverride,
  prettierConfig,
  typescriptConfigs,
} from './base.js'
import { nodeGlobalsConfig } from './node.js'
import { vueFilesConfig } from './vue.js'

/**
 * Nuxt-specific globals for auto-imports
 * These are commonly auto-imported by Nuxt and should not trigger no-undef errors
 */
const nuxtGlobals: Linter.Config = {
  name: 'node-toolkit/nuxt-globals',
  languageOptions: {
    globals: {
      // Vue auto-imports
      ref: 'readonly',
      computed: 'readonly',
      reactive: 'readonly',
      readonly: 'readonly',
      watch: 'readonly',
      watchEffect: 'readonly',
      toRef: 'readonly',
      toRefs: 'readonly',
      isRef: 'readonly',
      unref: 'readonly',
      shallowRef: 'readonly',
      shallowReactive: 'readonly',
      onMounted: 'readonly',
      onBeforeMount: 'readonly',
      onBeforeUnmount: 'readonly',
      onUnmounted: 'readonly',
      onUpdated: 'readonly',
      onBeforeUpdate: 'readonly',
      nextTick: 'readonly',
      provide: 'readonly',
      inject: 'readonly',

      // Nuxt auto-imports
      useRouter: 'readonly',
      useRoute: 'readonly',
      useFetch: 'readonly',
      useAsyncData: 'readonly',
      useLazyFetch: 'readonly',
      useLazyAsyncData: 'readonly',
      useState: 'readonly',
      useCookie: 'readonly',
      useRequestHeaders: 'readonly',
      useRequestEvent: 'readonly',
      useRuntimeConfig: 'readonly',
      useAppConfig: 'readonly',
      useHead: 'readonly',
      useSeoMeta: 'readonly',
      useNuxtApp: 'readonly',
      useError: 'readonly',
      navigateTo: 'readonly',
      abortNavigation: 'readonly',
      definePageMeta: 'readonly',
      defineNuxtComponent: 'readonly',
      defineNuxtPlugin: 'readonly',
      defineNuxtRouteMiddleware: 'readonly',
      createError: 'readonly',
      showError: 'readonly',
      clearError: 'readonly',
      reloadNuxtApp: 'readonly',
      refreshNuxtData: 'readonly',
      callOnce: 'readonly',
      prefetchComponents: 'readonly',
      preloadComponents: 'readonly',
      preloadRouteComponents: 'readonly',
      addRouteMiddleware: 'readonly',

      // Process (Nuxt provides this)
      $fetch: 'readonly',
    },
  },
}

/**
 * Nuxt-specific override for Vue files
 * Disables multi-word component names rule (pages/index.vue is common in Nuxt)
 */
const nuxtVueOverride: Linter.Config = {
  name: 'node-toolkit/nuxt-vue-override',
  files: ['**/*.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}

/**
 * Complete ESLint configuration for Nuxt projects
 *
 * This configuration includes globals for Nuxt's auto-imports (composables, components, etc.)
 *
 * @example
 * ```typescript
 * // eslint.config.ts
 * import nuxtConfig from '@vfourny/node-toolkit/eslint/nuxt'
 *
 * export default nuxtConfig
 * ```
 *
 * @remarks
 * For optimal type safety with Nuxt auto-imports, ensure your project:
 * 1. Has a `.nuxt` directory generated (run `nuxt prepare` or `nuxt dev` once)
 * 2. Includes `.nuxt/tsconfig.json` in your project's tsconfig extends
 *
 * The auto-imported globals defined here cover the most common Nuxt composables,
 * but you may need to add project-specific auto-imports to your local ESLint config.
 */
export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  nuxtGlobals,
  baseConfig,
  vueFilesConfig,
  nuxtVueOverride,
  prettierConfig,
  configFilesOverride,
  commonIgnores,
)
