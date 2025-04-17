import type { UserConfig } from '@commitlint/types'

export const defaultConfig: UserConfig = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'chore',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
  },
}

export const createCommitlintMonorepoConfig = (options: {
  scopes?: string[]
  extraRules?: UserConfig['rules']
}): UserConfig => {
  const { scopes = [], extraRules = {} } = options

  return {
    extends: ['@commitlint/config-angular'],
    parserPreset: {
      parserOpts: {
        headerPattern:
          /^(\w*)(?:\(([\w$.\-*/ ]+)(?::([\w$.\-*/ ]+))?\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subScope', 'subject'],
      },
    },
    rules: {
      ...defaultConfig.rules,
      'scope-enum': [2, 'always', scopes],
      'custom-subscope-validation': [2, 'always'],
      ...extraRules,
    },
    plugins: [
      {
        rules: {
          'custom-subscope-validation': ({ subScope }: any) => {
            if (!subScope) return [false, '']
            return [true, '']
          },
        },
      },
    ],
  }
}

export default defaultConfig
