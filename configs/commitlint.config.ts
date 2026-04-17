import type { UserConfig } from '@commitlint/types'

export const defaultConfig: UserConfig = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
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
  },
}

export const createCommitlintMonorepoConfig = (options: {
  scopes?: string[]
  extraRules?: UserConfig['rules']
}): UserConfig => {
  const { extraRules = {}, scopes = [] } = options

  return {
    ...defaultConfig,
    rules: {
      ...defaultConfig.rules,
      'scope-enum': [2, 'always', scopes],
      ...extraRules,
    },
  }
}

export default defaultConfig
