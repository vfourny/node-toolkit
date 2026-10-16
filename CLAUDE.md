# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a shared configuration toolkit for Node.js projects, published as `@vfourny/node-toolkit`. It provides:

- **Pre-configured setups** for ESLint, Prettier, TypeScript, Commitlint, and Vitest
- **Multiple configurations** tailored for Node.js, Vue.js, Nuxt, React and Next.js projects
- **Utility functions** for common string operations (kebabCase, lowerCaseFirstLetter)
- **Comprehensive testing** with Vitest

All configurations can be imported and extended by consumer projects.

## Common Commands

### Build and Type Checking

- `npm run build` - Compile TypeScript using project references
- `npm run ts:check` - Type check src, configs and tests without emitting files

### Linting and Formatting

- `npm run lint` - Run ESLint on the codebase
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted
- `npm run lint:package` - Check the packed package with publint and arethetypeswrong (run after `npm run build`)

### Testing

- `npm test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:coverage` - Generate coverage report

## Architecture

### TypeScript Project Structure

The project uses TypeScript project references with three separate compilation targets:

1. **tsconfig.src.json** - Compiles library code from `src/` to `dist/libs/`
   - Contains utility functions like `kebabCase` and `lowerCaseFirstLetter`
   - Exports from `src/index.ts` to `dist/libs/index.js`

2. **tsconfig.configs.json** - Compiles configuration files from `configs/` to `dist/configs/`
   - ESLint configurations (base, node, vue, nuxt, react, next)
   - Prettier configuration
   - Commitlint configuration
   - Vitest configuration
   - TypeScript base configurations (base, node, vue, nuxt, react, next, test)

3. **tsconfig.tests.json** - Type checks test files from `tests/` (not part of the build references)
   - Uses the test TypeScript configuration
   - Resolves `@/*` directly to `src/` sources, so `npm run ts:check` works without a prior build

The main `tsconfig.json` orchestrates these using project references. This multi-target architecture allows the package to export both:

- Library utilities (from `src/index.ts`) at `dist/libs/index.js`
- Configuration files from `dist/configs/` for direct importing

### Package Exports

The package uses explicit exports in package.json:

**ESLint configurations:**

- `@vfourny/node-toolkit/eslint` → Default ESLint configuration (Node.js)
- `@vfourny/node-toolkit/eslint/base` → Base ESLint configuration for custom composition
- `@vfourny/node-toolkit/eslint/node` → Node.js ESLint configuration
- `@vfourny/node-toolkit/eslint/vue` → Vue.js ESLint configuration
- `@vfourny/node-toolkit/eslint/nuxt` → Nuxt.js ESLint configuration
- `@vfourny/node-toolkit/eslint/react` → React ESLint configuration
- `@vfourny/node-toolkit/eslint/next` → Next.js ESLint configuration

**TypeScript configurations:**

- `@vfourny/node-toolkit/tsconfig` → Default TypeScript configuration (Node.js)
- `@vfourny/node-toolkit/tsconfig/base` → Base TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/node` → Node.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/vue` → Vue.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/nuxt` → Nuxt.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/react` → React TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/next` → Next.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/test` → Test files TypeScript configuration

**Other configurations:**

- `@vfourny/node-toolkit/prettier` → Prettier configuration
- `@vfourny/node-toolkit/commitlint` → Commitlint configuration
- `@vfourny/node-toolkit/vitest` → Vitest configuration

**Library utilities:**

- `@vfourny/node-toolkit` → Utility functions (kebabCase, lowerCaseFirstLetter)

Each export points to the compiled output in `dist/` with both `.js` and `.d.ts` files.

### Configuration Philosophy

All configuration files are written in TypeScript/ESM format (stored in `configs/` directory) and compiled to JavaScript in `dist/configs/`. The configurations are designed to be extended by consumer projects rather than used as-is.

#### ESLint Configurations (configs/eslint/)

The package provides multiple ESLint configurations:

- **base.ts** - Core ESLint configuration with shared rules, can be composed with other configs
- **node.ts** - Node.js specific configuration (includes Node.js globals)
- **vue.ts** - Vue.js configuration (includes Vue plugin and component naming rules)
- **nuxt.ts** - Nuxt configuration meant to be passed to `withNuxt()` from `@nuxt/eslint`: adds toolkit rules only, never registers the `@typescript-eslint`, `import` or `vue` plugins (Nuxt registers its own instances; redefining them makes ESLint throw)
- **react.ts** - React configuration (eslint-plugin-react + react-hooks)
- **next.ts** - Next.js configuration (React rules + @next/eslint-plugin-next, default exports allowed in Next file conventions)

Framework plugins (vue, react, react-hooks, next) are optional peerDependencies: only import them from their own config file so other configs keep working without them.

- `@vfourny/node-toolkit/eslint` (no subpath) resolves to node.ts

All configurations:

- Enforce TypeScript strict rules and stylistic conventions
- Forbid parent relative imports (`../`), sibling imports (`./`) are allowed; aliases are `@/`, `~/` or `#src/`
- Enforce interface over type for type definitions
- Sort imports/exports/interfaces/class members with perfectionist (objects are intentionally not sorted)
- Sort JSON keys with jsonc, except `package.json` and `tsconfig*.json`
- Use eslint-plugin-import-x registered under the `import` namespace (same as @nuxt/eslint)
- Use flat config format (ESLint 9+)
- Disallow default exports (except in `*.config.*` files and framework conventions)

`createTypeCheckedConfigs(tsconfigRootDir)` in base.ts provides opt-in type-aware rules (project service).

#### TypeScript Configurations (configs/tsconfig/)

The package provides multiple TypeScript base configurations:

- **base.json** - Core TypeScript configuration with strict settings
  - `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, no unused locals/parameters
  - `verbatimModuleSyntax`
  - ESNext modules with bundler resolution
  - ES2022 target
- **node.json** - Node.js configuration (extends base, `NodeNext` so tsc output runs on Node; aliases via package.json `imports` such as `#src/*`, not `paths`)
- **vue.json** - Vue.js app configuration (extends base, `jsx: preserve`, noEmit: the bundler compiles, includes every `.ts`/`.tsx`/`.vue` file)
- **nuxt.json** - Strictness flags only, injected into Nuxt's generated tsconfigs via `typescript.tsConfig` / `nodeTsConfig` / `sharedTsConfig` and `nitro.typescript.tsConfig`
- **react.json** - React app configuration (extends base, `jsx: react-jsx`, noEmit: the bundler compiles, includes every `.ts`/`.tsx` file)
- **next.json** - Next.js configuration (extends base, noEmit, `next` TS plugin)
- **test.json** - Test files configuration (extends base, Node types; Vitest globals are disabled)

#### Prettier Configuration (configs/prettier.config.ts)

- Provides standard Prettier formatting rules
- Can be extended with custom settings
- Ensures consistent code formatting across projects

#### Commitlint Configuration (configs/commitlint.config.ts)

- Extends Angular commit convention
- Exports two configs:
  - `defaultConfig` - Standard Angular commits with required scope
  - `createCommitlintMonorepoConfig()` - Factory for monorepo setups with scope validation and optional subscopes

#### Vitest Configuration (configs/vitest.config.ts)

- Node.js environment by default
- Globals disabled: test APIs are imported from `vitest`
- V8 coverage provider
- Text, JSON, and HTML coverage reports
- Default reporter for test results
- Can be merged with project-specific configuration

### Build Output

When building, TypeScript:

1. Compiles `src/index.ts` → `dist/libs/index.js` + `.d.ts`
   - Exports utility functions like `kebabCase` and `lowerCaseFirstLetter`

2. Compiles `configs/**/*.ts` → `dist/configs/**/*.js` + `.d.ts`
   - ESLint configurations (base, node, vue, nuxt, react, next)
   - Prettier, Commitlint, and Vitest configurations

3. Copies `configs/tsconfig/*.json` → `dist/configs/tsconfig/*.json`
   - TypeScript base configurations for different project types

Only the `dist/` directory is published to npm (specified in package.json `files` array).

## Important Constraints

- **No default exports** - The ESLint config enforces `import/no-default-export` everywhere except `*.config.*` files
- **Shared tsconfig key order** - `configs/tsconfig/*.json` keep a grouped, commented key order (`jsonc/sort-keys` is off for them)
- **Strict TypeScript** - Full strict mode enabled with no implicit any, unused locals/parameters forbidden
- **Node version** - Requires Node.js >= 22
- **TypeScript version** - Supports `>=5.5.2 <6.1.0`, bounded by typescript-eslint (TypeScript 7 has no JS API). Shared tsconfigs must not use `baseUrl` (error in TS 6, removed in TS 7) and must list needed `types` explicitly (TS 6 defaults `types` to `[]`)
- **Config sources must be `.ts` or `.json`** - tsc only emits those; `tests/exports.test.ts` checks every `exports` entry maps to an existing source (and has a default export where expected)
- **Testing** - Uses Vitest for testing utility functions and configurations

## Utility Functions

The package exports utility functions from `src/index.ts`:

- **`kebabCase(string: string): string`** - Converts various string formats (camelCase, PascalCase, snake_case, spaces) to kebab-case
- **`lowerCaseFirstLetter(string: string): string`** - Converts the first letter of a string to lowercase

These utilities are tested in `tests/index.test.ts` with comprehensive test coverage. Package `exports` are validated in `tests/exports.test.ts`. Each ESLint config is smoke-tested against sample files in `tests/eslint-configs.test.ts`.
