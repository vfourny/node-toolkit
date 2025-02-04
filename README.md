# VFourny's Node Toolkit

[![fr](https://img.shields.io/badge/lang-fr-blue)](https://github.com/vfourny/node-toolkit/blob/main/README.fr.md)

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

## Environment Variables

For `semantic-release` to work properly, certain environment variables must be defined in your GitHub repository configuration.

### Required Environment Variables

- `NPM_TOKEN`: Access token for npm to publish packages.
- `IS_PUBLISH`: Indicates whether the workflow should publish an npm package.

## Configuration Files

- `eslint.config.js`: ESLint configuration for JavaScript code linting.
- `prettier.config.js`: Prettier configuration for JavaScript code formatting.
- `tsconfig.json`: TypeScript configuration for transpiling TypeScript code.
- `release.config.js`: Semantic Release configuration for version management.
- `commitlintrc.js`: Commitlint configuration for commit message validation.

### ESLint

To import the ESLint configuration into your project, add the following code to your [ESLint](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file) configuration file:

```javascript
import nodeToolkitEslintConfig from "@vfourny/node-toolkit/eslint"

export default {
  ...nodeToolkitEslintConfig,
  // Your custom configurations
}
```

### Prettier

To import the Prettier configuration into your project, add the following code to your [Prettier](https://prettier.io/docs/en/configuration.html) configuration file:

```javascript
import nodeToolkitPrettierConfig from "@vfourny/node-toolkit/prettier"

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
    // Your custom configurations
  }
}
```

### Semantic Release

To import the Semantic Release configuration into your project, add the following code to your [Semantic Release](https://semantic-release.gitbook.io/semantic-release) configuration file:

```javascript
import nodeToolkitReleaseConfig from "@vfourny/node-toolkit/release"

export default {
  extends: "@vfourny/node-toolkit/release",
  // Your custom configurations
}
```

### Commitlint

To import the Commitlint configuration into your project, add the following code to your [Commitlint](https://commitlint.js.org/#/concepts-shareable-config) configuration file:

```javascript
export default {
  extends: "@vfourny/node-toolkit/commitlint",
}
```

---

_Thank you for using **VFourny's Node Toolkit**! For any questions or support, please open an issue on the GitHub repository._
