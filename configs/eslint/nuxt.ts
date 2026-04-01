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
  languageOptions: {
    globals: {
      // Process (Nuxt provides this)
      $fetch: 'readonly',

      abortNavigation: 'readonly',

      addRouteMiddleware: 'readonly',

      callOnce: 'readonly',

      clearError: 'readonly',

      computed: 'readonly',

      createError: 'readonly',

      defineNuxtComponent: 'readonly',

      defineNuxtPlugin: 'readonly',

      defineNuxtRouteMiddleware: 'readonly',

      definePageMeta: 'readonly',

      inject: 'readonly',

      isRef: 'readonly',

      navigateTo: 'readonly',

      nextTick: 'readonly',

      onBeforeMount: 'readonly',

      onBeforeUnmount: 'readonly',

      onBeforeUpdate: 'readonly',

      onMounted: 'readonly',

      onUnmounted: 'readonly',

      onUpdated: 'readonly',

      prefetchComponents: 'readonly',

      preloadComponents: 'readonly',

      preloadRouteComponents: 'readonly',

      provide: 'readonly',

      reactive: 'readonly',

      readonly: 'readonly',

      // Vue auto-imports
      ref: 'readonly',

      refreshNuxtData: 'readonly',

      reloadNuxtApp: 'readonly',

      shallowReactive: 'readonly',

      shallowRef: 'readonly',

      showError: 'readonly',

      toRef: 'readonly',

      toRefs: 'readonly',

      unref: 'readonly',

      useAppConfig: 'readonly',

      useAsyncData: 'readonly',

      useCookie: 'readonly',

      useError: 'readonly',

      useFetch: 'readonly',

      useHead: 'readonly',

      useLazyAsyncData: 'readonly',

      useLazyFetch: 'readonly',

      useNuxtApp: 'readonly',

      useRequestEvent: 'readonly',

      useRequestHeaders: 'readonly',

      useRoute: 'readonly',

      // Nuxt auto-imports
      useRouter: 'readonly',

      useRuntimeConfig: 'readonly',

      useSeoMeta: 'readonly',

      useState: 'readonly',

      watch: 'readonly',

      watchEffect: 'readonly',
    },
  },
  name: 'node-toolkit/nuxt-globals',
}

/**
 * Nuxt-specific override for Vue files
 * Disables multi-word component names rule (pages/index.vue is common in Nuxt)
 */
const nuxtVueOverride: Linter.Config = {
  files: ['**/*.vue'],
  name: 'node-toolkit/nuxt-vue-override',
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
