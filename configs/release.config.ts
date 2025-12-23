/**
 * Semantic Release configuration
 *
 * This configuration automates versioning and package publishing with:
 * - Commit analysis for version bumps (follows Angular convention)
 * - Automatic changelog generation in docs/CHANGELOG.md
 * - GitHub release creation
 * - NPM publishing (only when PUBLISH=true)
 * - Git commits for changelog and package.json updates
 *
 * @example
 * ```javascript
 * // release.config.js
 * export { default } from '@vfourny/node-toolkit/release'
 * ```
 *
 * Or with customization:
 * ```javascript
 * // release.config.js
 * import baseConfig from '@vfourny/node-toolkit/release'
 *
 * export default {
 *   ...baseConfig,
 *   branches: ['main', 'next'],
 * }
 * ```
 */
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
}
