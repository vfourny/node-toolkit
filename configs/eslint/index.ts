/**
 * ESLint configurations for different project types
 * @packageDocumentation
 */

// Export base configuration components for advanced usage
export * from './base'

// Export pre-configured setups for different project types
export { default as nodeConfig } from './node'
export { default as nuxtConfig } from './nuxt'
export { default as vueConfig } from './vue'

// Default export is the Node.js config (most common use case)
export { default } from './node'
