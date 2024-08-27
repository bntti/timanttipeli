// @ts-check

import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import url from 'node:url';
import tseslint from 'typescript-eslint';

// Inspiration taken from https://github.com/typescript-eslint/typescript-eslint/blob/main/eslint.config.mjs

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default tseslint.config(
    // Register all of the plugins up-front
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            // https://github.com/import-js/eslint-plugin-import/issues/2948
            import: fixupPluginRules(importPlugin),
            react: reactPlugin,
            'react-refresh': reactRefresh,
            'react-hooks': reactHooksPlugin,
        },
    },

    // Ignores
    {
        ignores: ['**/node_modules/**', '**/dist/**', 'backend/esbuild.mjs', '.prettierrc.js'],
    },

    // Extends ...
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintConfigPrettier,

    // Base config
    {
        languageOptions: {
            globals: { ...globals.es2022 },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
        linterOptions: { reportUnusedDisableDirectives: 'error' },

        rules: {
            ...importPlugin.configs.recommended.rules,
            ...importPlugin.configs.typescript.rules,

            'dot-notation': 'warn',
            'no-constant-condition': ['error', { checkLoops: false }],
            'no-unused-vars': 'off', // Replaced by @typescript-eslint rule
            'require-jsdoc': 'off',
            'spaced-comment': ['warn', 'always', { markers: ['/'] }],
            'valid-jsdoc': 'off',
            camelcase: 'warn',
            eqeqeq: 'error',
            'sort-imports': ['warn', { ignoreDeclarationSort: true }],

            '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
            '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/no-unnecessary-template-expression': 'warn',
            '@typescript-eslint/switch-exhaustiveness-check': 'error',

            'import/default': 'off', // Broken by new eslint
            'import/extensions': 'off', // Broken by new eslint
            'import/namespace': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-named-as-default': 'off', // Broken by new eslint
            'import/no-unresolved': 'off', // Broken by new eslint
            'import/order': [
                'warn',
                {
                    // ignoreDeclarationSort: true,
                    groups: [
                        ['builtin', 'external'],
                        ['internal', 'parent', 'sibling', 'index'],
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                    },
                    // https://github.com/import-js/eslint-plugin-import/issues/2008#issuecomment-801263294
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    distinctGroup: false,
                    pathGroupsExcludedImportTypes: ['builtin', 'object'],
                },
            ],
            'import/prefer-default-export': 'off',
        },
    },

    // Eslint
    {
        languageOptions: { globals: { ...globals.node } },
        files: ['eslint.config.mjs'],
    },

    // Backend
    {
        files: ['server/src/**/*.{ts,tsx}'],
        languageOptions: {
            globals: { ...globals.node },
        },
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'error',
        },
    },

    // Frontend
    {
        files: ['frontend/src/**/*.{ts,tsx}'],
        languageOptions: {
            globals: { ...globals.browser },
        },
        rules: {
            // TODO: rules
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,

            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-misused-promises': [
                'warn',
                { checksVoidReturn: { attributes: false } }, // To allow async onClick
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
);
