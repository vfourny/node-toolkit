# VFourny's Node Toolkit

[![fr](https://img.shields.io/badge/lang-fr-blue)](https://github.com/vfourny/node-toolkit/blob/main/docs/README.fr.md)

Shared configurations for ESLint, TypeScript, Prettier, Vitest and Commitlint, for **Node.js, Vue, Nuxt, React and Next.js** projects.

## Table of Contents

- [Installation](#installation)
- [ESLint](#eslint)
- [TypeScript](#typescript)
- [Prettier](#prettier)
- [Vitest](#vitest)
- [Commitlint](#commitlint)
- [Utility Functions](#utility-functions)
- [Migrating from 2.x](#migrating-from-2x)
- [Migrating from 1.x](#migrating-from-1x)

## Installation

```bash
npm install -D @vfourny/node-toolkit
```

### Peer Dependencies

```bash
npm install -D eslint prettier typescript commitlint
```

**Supported versions:**

- Node.js: `>= 22`
- ESLint: `^9.3.0`
- Prettier: `^3.2.5`
- TypeScript: `>=5.5.2 <6.1.0` (TypeScript 7 is not supported yet: `typescript-eslint` needs the TypeScript JavaScript API, which TypeScript 7 does not provide)
- Commitlint: `^19.8.0 || ^20.1.0`

**Framework plugins (optional, install only what your project uses):**

```bash
# Vue
npm install -D eslint-plugin-vue vue-eslint-parser
# Nuxt (the module provides the Vue and TypeScript setup)
npx nuxi module add eslint
# React
npm install -D eslint-plugin-react eslint-plugin-react-hooks
# Next.js
npm install -D eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next
# Vitest coverage
npm install -D @vitest/coverage-v8
```

## ESLint

Pick the configuration matching your project:

| Project | Import                                                    |
| ------- | --------------------------------------------------------- |
| Node.js | `@vfourny/node-toolkit/eslint` or `.../eslint/node`       |
| Vue     | `@vfourny/node-toolkit/eslint/vue`                        |
| Nuxt    | `@vfourny/node-toolkit/eslint/nuxt` (with `@nuxt/eslint`) |
| React   | `@vfourny/node-toolkit/eslint/react`                      |
| Next.js | `@vfourny/node-toolkit/eslint/next`                       |

```typescript
// eslint.config.ts
import config from '@vfourny/node-toolkit/eslint/react'

export default config
```

### Nuxt

The Nuxt configuration is composed with [`@nuxt/eslint`](https://eslint.nuxt.com), which generates the Nuxt-aware setup (parsers, Vue/TypeScript plugins, auto-imports, project structure). The toolkit only adds its rules on top, without registering the plugins Nuxt already provides.

```javascript
// eslint.config.mjs
import nuxtConfig from '@vfourny/node-toolkit/eslint/nuxt'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(nuxtConfig)
```

### Type-aware rules (opt-in)

`no-floating-promises`, `no-misused-promises`, `await-thenable`, `no-unsafe-*`, `switch-exhaustiveness-check`, ... These rules type check every file, so linting is slower.

```typescript
// eslint.config.ts
import { createTypeCheckedConfigs } from '@vfourny/node-toolkit/eslint/base'
import nodeConfig from '@vfourny/node-toolkit/eslint/node'

export default [...nodeConfig, ...createTypeCheckedConfigs(import.meta.dirname)]
```

For Nuxt, use the type-aware option of `@nuxt/eslint` instead.

### Custom composition

```typescript
// eslint.config.ts
import {
  baseConfig,
  commonIgnores,
  prettierConfig,
  typescriptConfigs,
} from '@vfourny/node-toolkit/eslint/base'
import { nodeGlobalsConfig } from '@vfourny/node-toolkit/eslint/node'

export default [
  ...typescriptConfigs,
  nodeGlobalsConfig,
  baseConfig,
  // Your custom configs here
  prettierConfig, // Should come after rule configs
  commonIgnores,
]
```

### Rules overview

**Code quality**

- `eqeqeq`, `prefer-const`, `no-var`, `no-debugger`, `no-throw-literal`
- `no-console`: warning, `console.warn` and `console.error` are allowed

**TypeScript** (`typescript-eslint` recommended + strict + stylistic)

- `consistent-type-definitions`: `interface` over `type`
- `consistent-type-imports`: `import type` for type-only imports
- `no-explicit-any` (auto-fixed to `unknown`)
- `no-unused-vars` (except names prefixed with `_`)
- `naming-convention`: PascalCase classes, enums and type parameters; camelCase or PascalCase functions

**Imports and sorting**

- `no-restricted-imports`: parent relative imports (`../`) are forbidden, use an alias (`@/`, `~/`, `#src/`); sibling imports (`./`) are allowed
- `import/no-default-export`: named exports only, except in `*.config.*` files and framework conventions (Next.js and Nuxt special files)
- `perfectionist`: sorted imports (builtin, external, internal aliases, relative), exports, named imports/exports, interfaces and class members
- `jsonc/sort-keys`: sorted keys in JSON files, except `package.json` and `tsconfig*.json`

**Framework specific**

- **Node.js**: Node.js globals
- **Vue**: `eslint-plugin-vue` recommended, alphabetical attributes, PascalCase components in templates
- **Nuxt**: toolkit rules on top of `@nuxt/eslint`, single-word component names allowed, default exports allowed in `server/`, `plugins/`, `middleware/`, `modules/` and `app.config.ts`
- **React**: `eslint-plugin-react` (recommended + JSX runtime) on `.jsx`/`.tsx`, rules of hooks on all JS/TS files, sorted JSX props
- **Next.js**: React rules + `@next/eslint-plugin-next` (recommended + Core Web Vitals), default exports allowed in Next.js file conventions (`page`, `layout`, `pages/**`, `middleware`, ...)

## TypeScript

All configurations extend `@vfourny/node-toolkit/tsconfig/base`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noUnusedLocals`/`Parameters`, `verbatimModuleSyntax`, ES2022 target.

### Node.js

Native Node.js ESM resolution (`NodeNext`): the output of `tsc` runs as-is with `node`. Your package must be ESM (`"type": "module"`) and relative imports need the `.js` extension.

Use [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) instead of `paths` aliases, so Node.js resolves them at runtime (Node.js 22 requires a name after `#`, e.g. `#src/`):

```json
// package.json
{
  "type": "module",
  "imports": {
    "#src/*": {
      "types": "./src/*",
      "development": "./src/*",
      "default": "./dist/*"
    }
  }
}
```

```json
// tsconfig.json
{
  "extends": "@vfourny/node-toolkit/tsconfig/node"
}
```

```typescript
import { double } from '#src/lib/math.js'
```

TypeScript resolves `#src/*` to the sources (`types`), Vitest too (`development`), and Node.js to the compiled output (`default`).

### Vue and React

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/vue"
}
```

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/react"
}
```

Both are meant for **bundled apps** (Vite, ...): the bundler compiles the code, `tsc` (or `vue-tsc`) only type checks (`noEmit`, so `.ts` extensions can be imported). They define the `@/*` alias to `src/*` and include every `.ts`/`.tsx` (and `.vue`) file of the project, `src/` and beyond (`server/`, `vite.config.ts`, ...).

Add the types of your tooling, and redefine `paths` entirely if you need more aliases (`extends` replaces `paths`, it does not merge it):

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/react",
  "compilerOptions": {
    "types": ["vite/client"],
    "paths": {
      "@/*": ["./src/*"],
      "@server/*": ["./server/*"]
    }
  }
}
```

These configurations are for apps only: there is no component library configuration yet. `tsc` does not rewrite the `@/` alias nor the `.ts` extensions in the declarations it emits, so a library needs its own setup (for example extensionless relative imports, or a bundler plugin that generates the declarations).

### Next.js

Includes the `next` TypeScript plugin, `next-env.d.ts` and `.next/types`. Override `paths` if you don't use a `src/` directory.

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/next"
}
```

### Nuxt

Nuxt generates its own tsconfig files (`.nuxt/tsconfig.{app,server,shared,node}.json`) and owns module resolution, aliases and types. The Nuxt configuration only adds the toolkit strictness flags, injected in every generated context from `nuxt.config.ts`:

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

### Tests

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/test"
}
```

## Prettier

```javascript
// prettier.config.js
export { default } from '@vfourny/node-toolkit/prettier'
```

Or with customization:

```javascript
// prettier.config.js
import baseConfig from '@vfourny/node-toolkit/prettier'

export default {
  ...baseConfig,
  printWidth: 100,
}
```

Single quotes, no semicolons, trailing commas, 80 columns, LF line endings.

## Vitest

```typescript
// vitest.config.ts
import baseConfig from '@vfourny/node-toolkit/vitest'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['tests/**/*.test.ts'],
    },
  }),
)
```

- Node.js environment
- Test APIs are imported explicitly: `import { describe, expect, it } from 'vitest'`
- V8 coverage (install `@vitest/coverage-v8`), text, JSON and HTML reports

## Commitlint

```javascript
// commitlint.config.js
export { default } from '@vfourny/node-toolkit/commitlint'
```

Angular convention with a required scope. For monorepos, restrict scopes with `createCommitlintMonorepoConfig`:

```javascript
// commitlint.config.js
import { createCommitlintMonorepoConfig } from '@vfourny/node-toolkit/commitlint'

export default createCommitlintMonorepoConfig({ scopes: ['api', 'web'] })
```

## Utility Functions

```typescript
import { kebabCase, lowerCaseFirstLetter } from '@vfourny/node-toolkit'

kebabCase('HelloWorld') // 'hello-world'
kebabCase('hello_world') // 'hello-world'
lowerCaseFirstLetter('HelloWorld') // 'helloWorld'
```

## Migrating from 2.x

The Semantic Release configuration (`@vfourny/node-toolkit/release`) is removed, along with the `semantic-release` peer dependency. Release with the reusable `release.yml` workflow of [`vfourny/.github`](https://github.com/vfourny/.github) (release-please), or keep a local `release.config.js` with your own semantic-release setup.

## Migrating from 1.x

- **Framework plugins are optional peer dependencies**: install `eslint-plugin-vue` (Vue), `eslint-plugin-react` + `eslint-plugin-react-hooks` (React, Next.js) and `@next/eslint-plugin-next` (Next.js).
- **Nuxt**: install `@nuxt/eslint` and wrap the config with `withNuxt(nuxtConfig)`. Move `tsconfig/nuxt` to the `nuxt.config.ts` TypeScript options (see [Nuxt](#nuxt-1)).
- **`tsconfig/node`** uses `NodeNext`: ESM package, `.js` extensions on relative imports, subpath imports (`#src/*`) instead of `@/*` paths.
- **No more `baseUrl`** in shared tsconfigs: non-relative imports from the project root must go through `paths`.
- **Stricter base tsconfig**: `noUncheckedIndexedAccess`, `noImplicitOverride` and `verbatimModuleSyntax` are enabled.
- **Sorting**: objects are no longer sorted, `simple-import-sort` is replaced by `perfectionist` (update `eslint-disable` comments), `package.json`/`tsconfig*.json` keys are no longer sorted.
- **Imports**: `eslint-plugin-import` is replaced by `eslint-plugin-import-x` (rules keep the `import/` prefix); sibling relative imports (`./`) are now allowed.
- **Vitest**: globals are disabled, import test APIs from `vitest`.
