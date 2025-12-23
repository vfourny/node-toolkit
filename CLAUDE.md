# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a shared configuration toolkit for Node.js projects, published as `@vfourny/node-toolkit`. It provides:

- **Pre-configured setups** for ESLint, Prettier, TypeScript, Commitlint, Semantic Release, and Vitest
- **Multiple configurations** tailored for Node.js, Vue.js, and Nuxt.js projects
- **Utility functions** for common string operations (kebabCase, lowerCaseFirstLetter)
- **Comprehensive testing** with Vitest

All configurations can be imported and extended by consumer projects.

## Common Commands

### Build and Type Checking

- `npm run build` - Compile TypeScript using project references
- `npm run ts:check` - Type check without emitting files

### Linting and Formatting

- `npm run lint` - Run ESLint on the codebase
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

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
   - ESLint configurations (base, node, vue, nuxt)
   - Prettier configuration
   - Commitlint configuration
   - Release configuration
   - Vitest configuration
   - TypeScript base configurations (base, node, vue, nuxt, test)

3. **tsconfig.tests.json** - Compiles test files from `tests/`
   - Uses the test TypeScript configuration
   - References the src configuration for testing library code

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

**TypeScript configurations:**
- `@vfourny/node-toolkit/tsconfig` → Default TypeScript configuration (Node.js)
- `@vfourny/node-toolkit/tsconfig/base` → Base TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/node` → Node.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/vue` → Vue.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/nuxt` → Nuxt.js TypeScript configuration
- `@vfourny/node-toolkit/tsconfig/test` → Test files TypeScript configuration

**Other configurations:**
- `@vfourny/node-toolkit/prettier` → Prettier configuration
- `@vfourny/node-toolkit/commitlint` → Commitlint configuration
- `@vfourny/node-toolkit/release` → Semantic Release configuration
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
- **nuxt.ts** - Nuxt.js configuration (includes Vue rules + Nuxt auto-imports and globals)
- **index.ts** - Default export (same as node.ts)

All configurations:
- Enforce TypeScript strict rules and stylistic conventions
- Require absolute imports with `@/` prefix (no relative imports)
- Enforce interface over type for type definitions
- Auto-sort imports with simple-import-sort plugin
- Use flat config format (ESLint 9+)
- Disallow default exports (except in `*.config.{js,ts}` files)

#### TypeScript Configurations (configs/tsconfig/)

The package provides multiple TypeScript base configurations:

- **base.json** - Core TypeScript configuration with strict settings
  - Strict mode enabled
  - No implicit any
  - No unused locals/parameters
  - ESNext module resolution with bundler strategy
  - ES2020 target
- **node.json** - Node.js specific configuration (extends base)
- **vue.json** - Vue.js configuration (extends base, includes JSX support)
- **nuxt.json** - Nuxt.js configuration (extends vue)
- **test.json** - Test files configuration (extends base, includes Vitest types)

#### Prettier Configuration (configs/prettier.config.ts)

- Provides standard Prettier formatting rules
- Can be extended with custom settings
- Ensures consistent code formatting across projects

#### Commitlint Configuration (configs/commitlint.config.ts)

- Extends Angular commit convention
- Exports two configs:
  - `defaultConfig` - Standard Angular commits with required scope
  - `createCommitlintMonorepoConfig()` - Factory for monorepo setups with scope validation and optional subscopes

#### Semantic Release Configuration (configs/release.config.js)

- Publishes to npm only when `PUBLISH=true` environment variable is set
- Updates changelog in `docs/CHANGELOG.md`
- Commits changelog and package.json changes back to repo
- Configured for `main` branch only

#### Vitest Configuration (configs/vitest.config.ts)

- Node.js environment by default
- Global test APIs enabled (describe, it, expect, etc.)
- V8 coverage provider
- Text, JSON, and HTML coverage reports
- Default reporter for test results
- Can be merged with project-specific configuration

### Build Output

When building, TypeScript:

1. Compiles `src/index.ts` → `dist/libs/index.js` + `.d.ts`
   - Exports utility functions like `kebabCase` and `lowerCaseFirstLetter`

2. Compiles `configs/**/*.ts` → `dist/configs/**/*.js` + `.d.ts`
   - ESLint configurations (base, node, vue, nuxt, index)
   - Prettier, Commitlint, Release, and Vitest configurations

3. Copies `configs/tsconfig/*.json` → `dist/configs/tsconfig/*.json`
   - TypeScript base configurations for different project types

Only the `dist/` directory is published to npm (specified in package.json `files` array).

## Important Constraints

- **No default exports** - The ESLint config enforces `import/no-default-export` everywhere except `*.config.{js,ts}` files
- **Absolute imports required** - Must use `@/` prefix instead of relative paths
- **Strict TypeScript** - Full strict mode enabled with no implicit any, unused locals/parameters forbidden
- **Node version** - Requires Node.js >= 22 and npm >= 10.9.4
- **Testing** - Uses Vitest for testing utility functions and configurations

## Utility Functions

The package exports utility functions from `src/index.ts`:

- **`kebabCase(string: string): string`** - Converts various string formats (camelCase, PascalCase, snake_case, spaces) to kebab-case
- **`lowerCaseFirstLetter(string: string): string`** - Converts the first letter of a string to lowercase

These utilities are tested in `tests/index.test.ts` with comprehensive test coverage.
