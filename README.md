# VFourny's Node Toolkit

[![fr](https://img.shields.io/badge/lang-fr-blue)](https://github.com/vfourny/node-toolkit/blob/main/docs/README.fr.md)

Welcome to **VFourny's Node Toolkit**! This repository contains a collection of tools and configurations designed to simplify development and automation for your projects.

## Table of Contents

- [Installation](#installation)
- [Variables d'Environnement](#variables-d'environnement)
- [Fichiers de Configuration](#fichiers-de-configuration)
  - [Eslint](#eslint)
  - [Prettier](#prettier)
  - [TypeScript](#typescript)
  - [Semantic Release](#semantic-release)
  - [Commitlint](#commitlint)

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

- Node.js: `>=20.13 <25`
- ESLint: `^9.3.0`
- Prettier: `^3.2.5`
- TypeScript: `^5.5.2`
- Commitlint: `^19.8.0 || ^20.1.0`
- Semantic Release: `^24.0.0 || ^25.0.0`

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

```typescript
// eslint.config.ts
import nuxtConfig from '@vfourny/node-toolkit/eslint/nuxt'

export default nuxtConfig
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
  nodeGlobalsConfig,
  typescriptConfigs,
  prettierConfig,
} from '@vfourny/node-toolkit/eslint/base'
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
- `import/no-default-export`: Disallow default exports (except in `*.config.{js,ts}` files)
- `simple-import-sort/imports`: Auto-sort imports alphabetically
- `simple-import-sort/exports`: Auto-sort exports alphabetically

**Project-Specific:**

- **Node.js**: Includes Node.js global variables (`process`, `__dirname`, etc.)
- **Vue**: Includes Vue ESLint plugin rules, enforces PascalCase for component names in templates
- **Nuxt**: Includes Vue rules + auto-import globals for Nuxt composables (`useRouter`, `useFetch`, etc.), allows single-word component names for pages

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

To import the TypeScript configuration into your project, add the following code to your [TypeScript](https://www.typescriptlang.org/tsconfig) configuration file:

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
    // Your custom configurations
  }
}
```

**Important:** The `paths` configuration is required for the ESLint import resolver to work correctly with absolute imports using the `@/` prefix.

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

---

_Thank you for using **VFourny's Node Toolkit**! For any questions or support, please open an issue on the GitHub repository._
