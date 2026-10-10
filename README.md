# VFourny's Node Toolkit

[![fr](https://img.shields.io/badge/lang-fr-blue)](https://github.com/vfourny/node-toolkit/blob/main/docs/README.fr.md)

Welcome to **VFourny's Node Toolkit**! This repository contains a collection of tools and configurations designed to simplify development and automation for your projects.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Configuration Files](#configuration-files)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [TypeScript](#typescript)
  - [Vitest](#vitest)
  - [Semantic Release](#semantic-release)
  - [Commitlint](#commitlint)
- [Utility Functions](#utility-functions)

## Installation

To install **VFourny's Node Toolkit** via npm, make sure you have [Node.js](https://nodejs.org/) installed on your machine. Then, run the following command in your terminal:

```bash
npm install -D @vfourny/node-toolkit
```

### Peer Dependencies

This package requires the following peer dependencies to be installed in your project:

```bash
npm install -D eslint prettier typescript commitlint semantic-release
```

**Minimum versions:**

- Node.js: `>= 22`
- ESLint: `^9.3.0`
- Prettier: `^3.2.5`
- TypeScript: `>=5.5.2 <6.1.0` (TypeScript 7 is not supported yet: `typescript-eslint` requires the TypeScript JavaScript API, which TypeScript 7 does not provide)
- Commitlint: `^19.8.0 || ^20.1.0`
- Semantic Release: `^24.0.0 || ^25.0.0`

**Framework plugins (optional, install only what your project uses):**

```bash
# Vue
npm install -D eslint-plugin-vue
# Nuxt (the module provides the Vue and TypeScript setup)
npx nuxi module add eslint
# React
npm install -D eslint-plugin-react eslint-plugin-react-hooks
# Next.js
npm install -D eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next
```

## Environment Variables

For `semantic-release` to work properly, certain environment variables must be defined in your GitHub repository configuration.

### Required Environment Variables

- `NPM_TOKEN`: Access token for npm to publish packages.
- `IS_PUBLISH`: Indicates whether the workflow should publish an npm package.

## Configuration Files

- `eslint.config.ts`: ESLint configuration for JavaScript code linting.
- `prettier.js`: Prettier configuration for JavaScript code formatting.
- `tsconfig.json`: TypeScript configuration for transpiling TypeScript code.
- `release.config.js`: Semantic Release configuration for version management.
- `commitlintrc.js`: Commitlint configuration for commit message validation.

### ESLint

This package provides multiple ESLint configurations tailored for different project types. Choose the one that fits your project:

#### For Node.js Projects

```typescript
// eslint.config.ts
import nodeConfig from '@vfourny/node-toolkit/eslint/node'

export default nodeConfig
```

#### For Vue Projects

```typescript
// eslint.config.ts
import vueConfig from '@vfourny/node-toolkit/eslint/vue'

export default vueConfig
```

#### For Nuxt Projects

The Nuxt configuration is meant to be composed with [`@nuxt/eslint`](https://eslint.nuxt.com), which generates the Nuxt-aware setup (parsers, Vue/TypeScript plugins, auto-imports, project structure). The toolkit rules are added on top of it, without registering plugins Nuxt already provides.

```bash
npx nuxi module add eslint
```

```javascript
// eslint.config.mjs
import nuxtConfig from '@vfourny/node-toolkit/eslint/nuxt'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(nuxtConfig)
```

Default exports are allowed where Nuxt requires them (`server/**`, `plugins/**`, `middleware/**`, `modules/**`, `app.config.ts`).

#### For React Projects

Requires `eslint-plugin-react` and `eslint-plugin-react-hooks`.

```typescript
// eslint.config.ts
import reactConfig from '@vfourny/node-toolkit/eslint/react'

export default reactConfig
```

#### For Next.js Projects

Requires `eslint-plugin-react`, `eslint-plugin-react-hooks` and `@next/eslint-plugin-next`.

```typescript
// eslint.config.ts
import nextConfig from '@vfourny/node-toolkit/eslint/next'

export default nextConfig
```

#### Default Import (Node.js)

```typescript
// eslint.config.ts
import config from '@vfourny/node-toolkit/eslint'

export default config
```

#### Advanced Usage

For advanced users who want to compose their own configuration:

```typescript
// eslint.config.ts
import {
  baseConfig,
  typescriptConfigs,
  prettierConfig,
} from '@vfourny/node-toolkit/eslint/base'
import { nodeGlobalsConfig } from '@vfourny/node-toolkit/eslint/node'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  // Your custom configs here
  prettierConfig, // Should be last
)
```

#### Configuration Rules Overview

All ESLint configurations include the following enforced rules:

**Code Quality:**

- `eqeqeq`: Require `===` and `!==` instead of `==` and `!=`
- `prefer-const`: Prefer `const` over `let` when variables are not reassigned
- `no-console`: Disallow `console.log` statements (prevents debug code in production)
- `no-debugger`: Disallow `debugger` statements
- `no-var`: Require `let` or `const` instead of `var`

**TypeScript:**

- `@typescript-eslint/consistent-type-definitions`: Enforce `interface` over `type`
- `@typescript-eslint/no-explicit-any`: Disallow `any` type (suggests `unknown` instead)
- `@typescript-eslint/consistent-type-imports`: Enforce `import type` for type-only imports
- `@typescript-eslint/no-unused-vars`: Disallow unused variables (except those prefixed with `_`)
- `@typescript-eslint/naming-convention`: Enforce naming conventions (PascalCase for classes, camelCase for variables, etc.)

**Import Rules:**

- `no-restricted-imports`: **Disallow relative imports** - must use absolute imports with `@/` prefix
- `import/no-default-export`: Disallow default exports (except in `*.config.{js,mjs,cjs,ts,mts,cts}` files)
- `simple-import-sort/imports`: Auto-sort imports alphabetically
- `simple-import-sort/exports`: Auto-sort exports alphabetically

**Project-Specific:**

- **Node.js**: Includes Node.js global variables (`process`, `__dirname`, etc.)
- **Vue**: Includes Vue ESLint plugin rules, enforces PascalCase for component names in templates
- **Nuxt**: Toolkit rules (TypeScript, imports, Vue) layered on top of `@nuxt/eslint`, allows single-word component names for pages
- **React**: `eslint-plugin-react` (recommended + JSX runtime) on `.jsx`/`.tsx`, rules of hooks on all JS/TS files, sorted JSX props
- **Next.js**: React rules + `@next/eslint-plugin-next` (recommended + Core Web Vitals), default exports allowed in Next.js file conventions (`app/**/page.tsx`, `layout.tsx`, `pages/**`, `middleware.ts`, etc.)

**Import Resolution:**
All configurations automatically resolve TypeScript path aliases (like `@/*`) using `eslint-import-resolver-typescript`.

### Prettier

To import the Prettier configuration into your project, add the following code to your [Prettier](https://prettier.io/docs/en/configuration.html) configuration file:

```javascript
import nodeToolkitPrettierConfig from '@vfourny/node-toolkit/prettier'

export default {
  ...nodeToolkitPrettierConfig,
  // Your custom configurations
}
```

### TypeScript

This package provides multiple TypeScript configurations for different project types:

#### For Node.js Projects

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/node",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
    // Your custom configurations
  }
}
```

#### For Vue Projects

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/vue",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
    // Your custom configurations
  }
}
```

#### For Nuxt Projects

Nuxt generates its own tsconfig files (`.nuxt/tsconfig.{app,server,shared,node}.json`) and owns module resolution, aliases and types. The Nuxt configuration only adds the toolkit strictness flags (`noUnusedLocals`, `noImplicitReturns`, ...), injected in every generated context from `nuxt.config.ts`:

```typescript
// nuxt.config.ts
const toolkitTsConfig = { extends: '@vfourny/node-toolkit/tsconfig/nuxt' }

export default defineNuxtConfig({
  nitro: {
    typescript: { tsConfig: toolkitTsConfig },
  },
  typescript: {
    nodeTsConfig: toolkitTsConfig,
    sharedTsConfig: toolkitTsConfig,
    tsConfig: toolkitTsConfig,
  },
})
```

Keep the root `tsconfig.json` generated by Nuxt (project references to `.nuxt/tsconfig.*.json`).

#### For React Projects

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/react"
}
```

#### For Next.js Projects

Includes the `next` TypeScript plugin, `next-env.d.ts` and `.next/types`. Adjust `paths` if you don't use a `src/` directory.

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/next"
}
```

#### For Test Files

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/test",
  "compilerOptions": {
    // Your custom configurations
  }
}
```

#### Default Import (Node.js)

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
    // Your custom configurations
  }
}
```

**Important:** The `paths` configuration is required for the ESLint import resolver to work correctly with absolute imports using the `@/` prefix.

**Base Configuration:** All TypeScript configurations extend from `@vfourny/node-toolkit/tsconfig/base` which provides strict TypeScript settings including:

- Strict mode enabled
- No implicit any
- No unused locals/parameters
- ESNext module resolution
- ES2020 target

### Vitest

To use the Vitest configuration in your project, create a `vitest.config.ts` file:

```typescript
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '@vfourny/node-toolkit/vitest'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['tests/**/*.test.ts'],
      // Your custom configurations
    },
  }),
)
```

**Features:**

- Node.js environment by default
- Global test APIs enabled (`describe`, `it`, `expect`, etc.)
- V8 coverage provider (install `@vitest/coverage-v8` to use `vitest run --coverage`)
- Text, JSON, and HTML coverage reports
- Default reporter for test results

### Semantic Release

To import the Semantic Release configuration into your project, add the following code to your [Semantic Release](https://semantic-release.gitbook.io/semantic-release) configuration file:

```javascript
import nodeToolkitReleaseConfig from '@vfourny/node-toolkit/release'

export default {
  extends: '@vfourny/node-toolkit/release',
  // Your custom configurations
}
```

### Commitlint

To import the Commitlint configuration into your project, add the following code to your [Commitlint](https://commitlint.js.org/#/concepts-shareable-config) configuration file:

```javascript
export default {
  extends: '@vfourny/node-toolkit/commitlint',
}
```

## Utility Functions

This package also exports utility functions that can be used in your projects:

```typescript
import { kebabCase, lowerCaseFirstLetter } from '@vfourny/node-toolkit'

// Convert strings to kebab-case
kebabCase('HelloWorld') // 'hello-world'
kebabCase('myVariableName') // 'my-variable-name'
kebabCase('hello_world') // 'hello-world'

// Convert first letter to lowercase
lowerCaseFirstLetter('HelloWorld') // 'helloWorld'
lowerCaseFirstLetter('HELLO') // 'hELLO'
```

### Available Functions

- **`kebabCase(string: string): string`** - Converts camelCase, PascalCase, snake_case, or space-separated strings to kebab-case
- **`lowerCaseFirstLetter(string: string): string`** - Converts the first letter of a string to lowercase while preserving the rest

---

_Thank you for using **VFourny's Node Toolkit**! For any questions or support, please open an issue on the GitHub repository._
