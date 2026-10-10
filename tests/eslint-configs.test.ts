import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import { ESLint, type Linter } from 'eslint'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(import.meta.dirname, '..')

const loadConfig = async (name: string) =>
  (
    (await import(
      pathToFileURL(resolve(ROOT, `configs/eslint/${name}.ts`)).href
    )) as { default: Linter.Config[] }
  ).default

/**
 * Lints a virtual file with the given config and returns the reported rule ids.
 * Fails on parsing errors (messages without ruleId).
 */
const lint = async (
  config: Linter.Config[] | string,
  filePath: string,
  code: string,
) => {
  const eslint = new ESLint({
    cwd: ROOT,
    overrideConfig:
      typeof config === 'string' ? await loadConfig(config) : config,
    overrideConfigFile: true,
  })
  const [result] = await eslint.lintText(code, {
    filePath: resolve(ROOT, 'fixtures', filePath),
  })
  const messages = result?.messages ?? []

  expect(messages.filter((message) => !message.ruleId)).toEqual([])

  return messages.map((message) => message.ruleId)
}

describe('eslint configs', () => {
  it('node: should lint TypeScript files', async () => {
    const rules = await lint(
      'node',
      'src/sample.ts',
      'export const a: any = 1\n',
    )

    expect(rules).toContain('@typescript-eslint/no-explicit-any')
  })

  it('vue: should parse SFCs with TypeScript', async () => {
    const rules = await lint(
      'vue',
      'src/MyComponent.vue',
      '<script setup lang="ts">\nconst count = 1\n</script>\n\n<template>\n  <div>{{ count }}</div>\n</template>\n',
    )

    expect(rules).toEqual([])
  })

  describe('nuxt (composed with @nuxt/eslint)', () => {
    // Same composition as `withNuxt(nuxtConfig)` in a Nuxt project
    const loadNuxtConfig = async () =>
      createConfigForNuxt()
        .append(await loadConfig('nuxt'))
        .toConfigs() as Promise<Linter.Config[]>

    it('should not redefine plugins registered by Nuxt', async () => {
      const rules = await lint(
        await loadNuxtConfig(),
        'app/pages/index.vue',
        '<script setup lang="ts">\nconst { data } = await useFetch(\'/api\')\nconst value: any = data\n</script>\n\n<template>\n  <div>{{ value }}</div>\n</template>\n',
      )

      expect(rules).toEqual(['@typescript-eslint/no-explicit-any'])
    })

    it('should allow default exports in Nuxt file conventions only', async () => {
      const config = await loadNuxtConfig()

      expect(
        await lint(
          config,
          'server/api/hello.ts',
          "export default defineEventHandler(() => 'ok')\n",
        ),
      ).toEqual([])
      expect(
        await lint(
          config,
          'app/composables/useThing.ts',
          'export default function useThing() {\n  return 1\n}\n',
        ),
      ).toContain('import/no-default-export')
    })
  })

  it('react: should enforce the rules of hooks', async () => {
    const rules = await lint(
      'react',
      'src/Counter.tsx',
      [
        "import { useState } from 'react'",
        '',
        'export const Counter = ({ enabled }: { enabled: boolean }) => {',
        '  if (enabled) {',
        '    useState(0)',
        '  }',
        '',
        '  return <button type="button">count</button>',
        '}',
        '',
      ].join('\n'),
    )

    expect(rules).toContain('react-hooks/rules-of-hooks')
  })

  it('next: should allow default exports in route files only', async () => {
    const page = 'const Page = () => <main>page</main>\n\nexport default Page\n'

    expect(await lint('next', 'app/page.tsx', page)).toEqual([])
    expect(await lint('next', 'app/ui/Header.tsx', page)).toContain(
      'import/no-default-export',
    )
  })

  it('next: should apply Next.js plugin rules', async () => {
    const rules = await lint(
      'next',
      'app/ui/Logo.tsx',
      'export const Logo = () => <img alt="logo" src="/logo.png" />\n',
    )

    expect(rules).toContain('@next/next/no-img-element')
  })
})
