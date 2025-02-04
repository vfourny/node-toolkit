export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/npm',
      {
        npmPublish: process.env.PUBLISH === 'true',
        pkgRoot: '.',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['docs/CHANGELOG.md', 'package.json', 'package-lock.json'],
      },
    ],
  ],
};
