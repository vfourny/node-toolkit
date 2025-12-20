# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a shared configuration toolkit for Node.js projects, published as `@vfourny/node-toolkit`. It provides pre-configured setups for ESLint, Prettier, TypeScript, Commitlint, and Semantic Release that can be imported and extended by other projects.

## Common Commands

### Build and Type Checking

- `npm run build` - Compile TypeScript using project references
- `npm run type-check` - Type check without emitting files

### Linting and Formatting

- `npm run lint` - Run ESLint on the codebase
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

### Testing

This project does not have tests (CI/CD workflows have `is_tested: false`).

## Architecture

### TypeScript Project Structure

The project uses TypeScript project references with two separate compilation targets:

1. **tsconfig.src.json** - Compiles library code from `src/` to `dist/libs/`
2. **tsconfig.root.json** - Compiles root-level config files (eslint.config.ts, commitlint.config.ts, etc.) to `dist/`

The main `tsconfig.json` orchestrates these using project references. This dual-target architecture allows the package to export both:

- Library utilities (from `src/index.ts`) at `dist/libs/index.js`
- Configuration files at the root of `dist/` for direct importing

### Package Exports

The package uses explicit exports in package.json:

- `@vfourny/node-toolkit/eslint` → ESLint configuration
- `@vfourny/node-toolkit/prettier` → Prettier configuration
- `@vfourny/node-toolkit/commitlint` → Commitlint configuration
- `@vfourny/node-toolkit/release` → Semantic Release configuration
- `@vfourny/node-toolkit/tsconfig` → Base TypeScript configuration

Each export points to the compiled output in `dist/` with both `.js` and `.d.ts` files.

### Configuration Philosophy

All configuration files are written in TypeScript/ESM format and compiled to JavaScript. The configurations are designed to be extended by consumer projects rather than used as-is.

#### ESLint Configuration (eslint.config.ts)

- Enforces TypeScript strict rules and stylistic conventions
- Requires absolute imports with `@/` prefix (no relative imports)
- Enforces interface over type for type definitions
- Includes Vue support with PascalCase component naming
- Auto-sorts imports with simple-import-sort plugin
- Uses flat config format (ESLint 9+)

#### Commitlint Configuration (commitlint.config.ts)

- Extends Angular commit convention
- Exports two configs:
  - `defaultConfig` - Standard Angular commits with required scope
  - `createCommitlintMonorepoConfig()` - Factory for monorepo setups with scope validation and optional subscopes

#### Semantic Release (release.config.js)

- Publishes to npm only when `PUBLISH=true` environment variable is set
- Updates changelog in `docs/CHANGELOG.md`
- Commits changelog and package.json changes back to repo
- Configured for `main` branch only

### Build Output

When building, TypeScript:

1. Compiles `src/index.ts` → `dist/libs/index.js` + `.d.ts`
2. Compiles root configs → `dist/*.js` + `.d.ts`
3. Copies `tsconfig.base.json` to `dist/` (via package.json files array)

Only `dist/` and `tsconfig.base.json` are published to npm.

## Important Constraints

- **No default exports** - The ESLint config enforces `import/no-default-export` everywhere except `*.config.{js,ts}` files
- **Absolute imports required** - Must use `@/` prefix instead of relative paths
- **Strict TypeScript** - Full strict mode enabled with no implicit any, unused locals/parameters forbidden
- **Node version** - Requires Node.js >=20.13 <23
- **No tests** - This is a configuration package without test infrastructure
