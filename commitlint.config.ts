import type { UserConfig } from '@commitlint/types'

interface CommitParsedResult {
  type?: string
  scope?: string
  subScope?: string
  subject?: string
  [key: string]: string | undefined
}

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
          'custom-subscope-validation': ({ subScope }: CommitParsedResult) => {
            if (!subScope) return [false, '']
            return [true, '']
          },
        },
      },
    ],
  }
}

export default defaultConfig
