import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

interface ConditionalExport {
  default: string
  types: string
}

interface PackageJson {
  exports: Record<string, ConditionalExport | string>
}

const ROOT = resolve(import.meta.dirname, '..')

const packageJson = JSON.parse(
  readFileSync(resolve(ROOT, 'package.json'), 'utf8'),
) as PackageJson

// Entries exposing only named exports (no default export expected)
const NAMED_ONLY_ENTRIES = new Set(['.', './eslint/base'])

/**
 * Maps a compiled `dist/` path to the source file tsc compiles it from.
 * Only `.ts` and `.json` sources are emitted by the build.
 */
const toSourcePath = (distPath: string) =>
  resolve(
    ROOT,
    distPath
      .replace('./dist/configs/', 'configs/')
      .replace('./dist/libs/', 'src/')
      .replace(/\.js$/, '.ts'),
  )

describe('package exports', () => {
  it('should expose the library entry point', () => {
    expect(packageJson.exports['.']).toBeDefined()
  })

  for (const [entry, target] of Object.entries(packageJson.exports)) {
    if (typeof target === 'string') {
      it(`${entry} should point to an existing JSON source`, () => {
        expect(existsSync(toSourcePath(target))).toBe(true)
      })
      continue
    }

    it(`${entry} should be built from a TypeScript source`, () => {
      expect(target.types).toBe(target.default.replace(/\.js$/, '.d.ts'))
      expect(existsSync(toSourcePath(target.default))).toBe(true)
    })

    if (!NAMED_ONLY_ENTRIES.has(entry)) {
      it(`${entry} should have a default export`, async () => {
        const module = (await import(
          pathToFileURL(toSourcePath(target.default)).href
        )) as { default: unknown }

        expect(module.default).toBeDefined()
      })
    }
  }
})
