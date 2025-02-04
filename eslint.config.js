import eslintJS from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintPluginVue from 'eslint-plugin-vue';
import typescriptEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

const vueFilesConfig = {
                    name: 'eslint-config-seyrinian-tools/vue',
                    extends: [...eslintPluginVue.configs['flat/recommended']],
                    files: ['**/*.{ts,vue}'],
                    languageOptions: {
                                        ecmaVersion: 'latest',
                                        sourceType: 'module',
                                        globals: globals.browser,
                                        parserOptions: {
                                                            parser: typescriptEslint.parser,
                                        },
                    },
                    rules: {},
};

const defaultConfig = {
                    name: 'eslint-config-seyrinian-tools/default',
                    languageOptions: {
                                        globals: {
                                                            ...globals.node,
                                        },
                    },
                    rules: {
                                        'no-console': 'error',
                                        'no-debugger': 'error',
                    },
};

export default tseslint.config(
                    eslintJS.configs.recommended,
                    ...tseslint.configs.recommended,
                    ...tseslint.configs.strict,
                    ...tseslint.configs.stylistic,
                    vueFilesConfig,
                    defaultConfig,
                    eslintConfigPrettier,
                    {
                                        ignores: ['node_modules', 'dist/'],
                    },
);
