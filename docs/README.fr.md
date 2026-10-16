# VFourny's Node Toolkit

[![en](https://img.shields.io/badge/lang-en-red)](https://github.com/vfourny/node-toolkit/blob/main/README.md)

Configurations partagées pour ESLint, TypeScript, Prettier, Vitest et Commitlint, pour les projets **Node.js, Vue, Nuxt, React et Next.js**.

## Table des matières

- [Installation](#installation)
- [ESLint](#eslint)
- [TypeScript](#typescript)
- [Prettier](#prettier)
- [Vitest](#vitest)
- [Commitlint](#commitlint)
- [Fonctions utilitaires](#fonctions-utilitaires)
- [Migrer depuis la 2.x](#migrer-depuis-la-2x)
- [Migrer depuis la 1.x](#migrer-depuis-la-1x)

## Installation

```bash
npm install -D @vfourny/node-toolkit
```

### Peer dependencies

```bash
npm install -D eslint prettier typescript commitlint
```

**Versions supportées :**

- Node.js : `>= 22`
- ESLint : `^9.3.0`
- Prettier : `^3.2.5`
- TypeScript : `>=5.5.2 <6.1.0` (TypeScript 7 n'est pas encore supporté : `typescript-eslint` a besoin de l'API JavaScript de TypeScript, que TypeScript 7 ne fournit pas)
- Commitlint : `^19.8.0 || ^20.1.0`

**Plugins de framework (optionnels, n'installez que ceux de votre projet) :**

```bash
# Vue
npm install -D eslint-plugin-vue vue-eslint-parser
# Nuxt (le module fournit la configuration Vue et TypeScript)
npx nuxi module add eslint
# React
npm install -D eslint-plugin-react eslint-plugin-react-hooks
# Next.js
npm install -D eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next
# Couverture Vitest
npm install -D @vitest/coverage-v8
```

## ESLint

Choisissez la configuration adaptée à votre projet :

| Projet  | Import                                                    |
| ------- | --------------------------------------------------------- |
| Node.js | `@vfourny/node-toolkit/eslint` ou `.../eslint/node`       |
| Vue     | `@vfourny/node-toolkit/eslint/vue`                        |
| Nuxt    | `@vfourny/node-toolkit/eslint/nuxt` (avec `@nuxt/eslint`) |
| React   | `@vfourny/node-toolkit/eslint/react`                      |
| Next.js | `@vfourny/node-toolkit/eslint/next`                       |

```typescript
// eslint.config.ts
import config from '@vfourny/node-toolkit/eslint/react'

export default config
```

### Nuxt

La configuration Nuxt se compose avec [`@nuxt/eslint`](https://eslint.nuxt.com), qui génère la configuration propre à Nuxt (parsers, plugins Vue/TypeScript, auto-imports, structure du projet). Le toolkit ajoute uniquement ses règles par-dessus, sans réenregistrer les plugins déjà fournis par Nuxt.

```javascript
// eslint.config.mjs
import nuxtConfig from '@vfourny/node-toolkit/eslint/nuxt'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(nuxtConfig)
```

### Règles utilisant les types (optionnelles)

`no-floating-promises`, `no-misused-promises`, `await-thenable`, `no-unsafe-*`, `switch-exhaustiveness-check`… Ces règles vérifient les types de chaque fichier, le lint est donc plus lent.

```typescript
// eslint.config.ts
import { createTypeCheckedConfigs } from '@vfourny/node-toolkit/eslint/base'
import nodeConfig from '@vfourny/node-toolkit/eslint/node'

export default [...nodeConfig, ...createTypeCheckedConfigs(import.meta.dirname)]
```

Pour Nuxt, utilisez plutôt l'option équivalente de `@nuxt/eslint`.

### Composition personnalisée

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
  // Vos configurations ici
  prettierConfig, // Après les configurations de règles
  commonIgnores,
]
```

### Aperçu des règles

**Qualité du code**

- `eqeqeq`, `prefer-const`, `no-var`, `no-debugger`, `no-throw-literal`
- `no-console` : avertissement, `console.warn` et `console.error` sont autorisés

**TypeScript** (`typescript-eslint` recommended + strict + stylistic)

- `consistent-type-definitions` : `interface` plutôt que `type`
- `consistent-type-imports` : `import type` pour les imports de types
- `no-explicit-any` (corrigé automatiquement en `unknown`)
- `no-unused-vars` (sauf les noms préfixés par `_`)
- `naming-convention` : classes, enums et paramètres de type en PascalCase ; fonctions en camelCase ou PascalCase

**Imports et tris**

- `no-restricted-imports` : les imports relatifs parents (`../`) sont interdits, utilisez un alias (`@/`, `~/`, `#src/`) ; les imports voisins (`./`) sont autorisés
- `import/no-default-export` : exports nommés uniquement, sauf dans les fichiers `*.config.*` et les conventions des frameworks (fichiers spéciaux Next.js et Nuxt)
- `perfectionist` : tri des imports (modules Node, paquets externes, alias internes, relatifs), des exports, des imports/exports nommés, des interfaces et des membres de classe
- `jsonc/sort-keys` : clés triées dans les fichiers JSON, sauf `package.json` et `tsconfig*.json`

**Spécifique aux frameworks**

- **Node.js** : globales Node.js
- **Vue** : `eslint-plugin-vue` recommended, attributs triés, composants en PascalCase dans les templates
- **Nuxt** : règles du toolkit par-dessus `@nuxt/eslint`, noms de composants en un mot autorisés, exports par défaut autorisés dans `server/`, `plugins/`, `middleware/`, `modules/` et `app.config.ts`
- **React** : `eslint-plugin-react` (recommended + runtime JSX) sur `.jsx`/`.tsx`, règles des hooks sur tous les fichiers JS/TS, props JSX triées
- **Next.js** : règles React + `@next/eslint-plugin-next` (recommended + Core Web Vitals), exports par défaut autorisés dans les conventions Next.js (`page`, `layout`, `pages/**`, `middleware`…)

## TypeScript

Toutes les configurations étendent `@vfourny/node-toolkit/tsconfig/base` : `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noUnusedLocals`/`Parameters`, `verbatimModuleSyntax`, cible ES2022.

### Node.js

Résolution ESM native de Node.js (`NodeNext`) : le résultat de `tsc` s'exécute tel quel avec `node`. Votre paquet doit être en ESM (`"type": "module"`) et les imports relatifs doivent porter l'extension `.js`.

Utilisez les [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) plutôt que des alias `paths`, pour que Node.js les résolve à l'exécution (Node.js 22 exige un nom après le `#`, par exemple `#src/`) :

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

TypeScript résout `#src/*` vers les sources (`types`), Vitest aussi (`development`), et Node.js vers le code compilé (`default`).

### Vue et React

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

Ces deux configurations visent les **apps bundlées** (Vite…) : le bundler compile le code, `tsc` (ou `vue-tsc`) ne fait que vérifier les types (`noEmit`, ce qui permet d'importer les extensions `.ts`). Elles définissent l'alias `@/*` vers `src/*` et incluent tous les fichiers `.ts`/`.tsx` (et `.vue`) du projet, `src/` et au-delà (`server/`, `vite.config.ts`…).

Ajoutez les types de votre outillage, et redéfinissez `paths` en entier s'il vous faut d'autres alias (`extends` remplace `paths`, il ne le fusionne pas) :

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

Ces configurations visent uniquement les apps : il n'y a pas encore de configuration pour une librairie de composants. `tsc` ne réécrit ni l'alias `@/` ni les extensions `.ts` dans les déclarations qu'il génère, donc une librairie demande sa propre configuration (par exemple des imports relatifs sans extension, ou un plugin du bundler qui génère les déclarations).

### Next.js

Inclut le plugin TypeScript `next`, `next-env.d.ts` et `.next/types`. Surchargez `paths` si vous n'utilisez pas de dossier `src/`.

```json
{
  "extends": "@vfourny/node-toolkit/tsconfig/next"
}
```

### Nuxt

Nuxt génère ses propres tsconfig (`.nuxt/tsconfig.{app,server,shared,node}.json`) et gère la résolution des modules, les alias et les types. La configuration Nuxt ajoute seulement les options strictes du toolkit, injectées dans chaque contexte généré depuis `nuxt.config.ts` :

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

Gardez le `tsconfig.json` racine généré par Nuxt (références vers `.nuxt/tsconfig.*.json`).

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

Ou en personnalisant :

```javascript
// prettier.config.js
import baseConfig from '@vfourny/node-toolkit/prettier'

export default {
  ...baseConfig,
  printWidth: 100,
}
```

Guillemets simples, pas de points-virgules, virgules finales, 80 colonnes, fins de ligne LF.

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

- Environnement Node.js
- Les API de test s'importent explicitement : `import { describe, expect, it } from 'vitest'`
- Couverture V8 (installez `@vitest/coverage-v8`), rapports texte, JSON et HTML

## Commitlint

```javascript
// commitlint.config.js
export { default } from '@vfourny/node-toolkit/commitlint'
```

Convention Angular avec scope obligatoire. Pour les monorepos, limitez les scopes avec `createCommitlintMonorepoConfig` :

```javascript
// commitlint.config.js
import { createCommitlintMonorepoConfig } from '@vfourny/node-toolkit/commitlint'

export default createCommitlintMonorepoConfig({ scopes: ['api', 'web'] })
```

## Fonctions utilitaires

```typescript
import { kebabCase, lowerCaseFirstLetter } from '@vfourny/node-toolkit'

kebabCase('HelloWorld') // 'hello-world'
kebabCase('hello_world') // 'hello-world'
lowerCaseFirstLetter('HelloWorld') // 'helloWorld'
```

## Migrer depuis la 2.x

La configuration Semantic Release (`@vfourny/node-toolkit/release`) est supprimée, ainsi que la peer dependency `semantic-release`. Utilisez le workflow réutilisable `release.yml` de [`vfourny/.github`](https://github.com/vfourny/.github) (release-please), ou gardez un `release.config.js` local avec votre propre configuration semantic-release.

## Migrer depuis la 1.x

- **Les plugins de framework sont des peer dependencies optionnelles** : installez `eslint-plugin-vue` (Vue), `eslint-plugin-react` + `eslint-plugin-react-hooks` (React, Next.js) et `@next/eslint-plugin-next` (Next.js).
- **Nuxt** : installez `@nuxt/eslint` et enveloppez la configuration avec `withNuxt(nuxtConfig)`. Déplacez `tsconfig/nuxt` dans les options TypeScript de `nuxt.config.ts` (voir [Nuxt](#nuxt-1)).
- **`tsconfig/node`** utilise `NodeNext` : paquet ESM, extension `.js` sur les imports relatifs, subpath imports (`#src/*`) au lieu des `paths` `@/*`.
- **Plus de `baseUrl`** dans les tsconfig partagés : les imports non relatifs depuis la racine du projet doivent passer par `paths`.
- **tsconfig de base plus strict** : `noUncheckedIndexedAccess`, `noImplicitOverride` et `verbatimModuleSyntax` sont activés.
- **Tris** : les objets ne sont plus triés, `simple-import-sort` est remplacé par `perfectionist` (mettez à jour les commentaires `eslint-disable`), les clés de `package.json` et `tsconfig*.json` ne sont plus triées.
- **Imports** : `eslint-plugin-import` est remplacé par `eslint-plugin-import-x` (les règles gardent le préfixe `import/`) ; les imports relatifs voisins (`./`) sont désormais autorisés.
- **Vitest** : les globales sont désactivées, importez les API de test depuis `vitest`.
