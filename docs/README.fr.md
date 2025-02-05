# VFourny's Node Toolkit

[![en](https://img.shields.io/badge/lang-en-red)](https://github.com/vfourny/node-toolkit/blob/main/README.md)

Bienvenue dans **VFourny's Node Toolkit** ! Ce dépôt contient une collection d'outils et de configurations conçus pour faciliter le développement et l'automatisation de vos projets.

## Table des Matières

- [Installation](#installation)
- [Variables d'Environnement](#variables-d'environnement)
- [Fichiers de Configuration](#fichiers-de-configuration)
  - [Eslint](#eslint)
  - [Prettier](#prettier)
  - [TypeScript](#typescript)
  - [Semantic Release](#semantic-release)
  - [Commitlint](#commitlint)

## Installation

Pour installer **VFourny's Node Toolkit** via npm, assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine. Ensuite, exécutez la commande suivante dans votre terminal :

```bash
npm install -D @vfourny/node-toolkit
```

## Variables d'Environnement

Pour que `semantic-release` fonctionne correctement, certaines variables d'environnement doivent être définies dans la configuration de votre dépôt GitHub.

### Variables d'environnement requises

- `NPM_TOKEN` : Token d'accès à npm pour publier des packages.
- `IS_PUBLISH` : Indique si le workflow doit publier un package npm.

## Fichiers de Configuration

- `eslint.config.ts` : Configuration ESLint pour le linting du code JavaScript.
- `prettier.js` : Configuration Prettier pour le formatage du code JavaScript.
- `tsconfig.json` : Configuration TypeScript pour le transpilage du code TypeScript.
- `release.config.js` : Configuration Semantic Release pour la gestion des versions.
- `commitlintrc.js` : Configuration Commitlint pour la validation des messages de commit.

### Eslint

Pour importer la configuration ESLint dans votre projet, ajoutez le code suivant à votre fichier de config [ESLint](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file) :

```javascript
import nodeToolkitEslintConfig from '@vfourny/node-toolkit/eslint'

export default {
  ...nodeToolkitEslintConfig,
  // Vos configurations personnalisées
}
```

### Prettier

Pour importer la configuration Prettier dans votre projet, ajoutez le code suivant à votre fichier de config [Prettier](https://prettier.io/docs/en/configuration.html) :

```javascript
import nodeToolkitPrettierConfig from '@vfourny/node-toolkit/prettier'

export default {
  ...seyrinianToolsPrettierConfig,
  // Vos configurations personnalisées
}
```

### TypeScript

Pour importer la configuration TypeScript dans votre projet, ajoutez le code suivant à votre fichier de config [TypeScript](https://www.typescriptlang.org/tsconfig) :

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig",
  "compilerOptions": {
    // Vos configurations personnalisées
  }
}
```

### Semantic Release

Pour importer la configuration Semantic Release dans votre projet, ajoutez le code suivant à votre fichier de config [Semantic Release](https://semantic-release.gitbook.io/semantic-release) :

```javascript
import nodeToolkitReleaseConfig from '@vfourny/node-toolkit/release'

export default {
  extends: '@vfourny/node-toolkit/release',
  // Vos configurations personnalisées
}
```

### Commitlint

Pour importer la configuration Commitlint dans votre projet, ajoutez le code suivant à votre fichier de config [Commitlint](https://commitlint.js.org/#/concepts-shareable-config) :

```javascript
export default {
  extends: '@vfourny/node-toolkit/commitlint',
}
```

---

_Merci d'utiliser **VFourny's Node Toolkit** ! Pour toute question ou assistance, veuillez ouvrir une issue sur le dépôt GitHub._
