import { defineConfig } from 'oxlint';

export default defineConfig({
    plugins: [
        'eslint',
        'typescript',
        'unicorn',
        'react',
        // "react-perf",
        'import',
        'jsdoc',
        'node',
        'promise',
    ],
    options: {
        typeAware: true,
        typeCheck: true,
    },
    categories: {
        correctness: 'error',
        suspicious: 'error',
        pedantic: 'warn',
        perf: 'warn',
        style: 'warn',
        restriction: 'warn',
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
        'import/max-dependencies': 'off',
        'eslint/complexity': 'off',
        'eslint/no-warning-comments': 'off',
        'import/no-default-export': 'off',
        'eslint/no-void': 'off',
        'eslint/no-magic-numbers': 'off',
        'typescript/consistent-type-definitions': ['warn', 'type'],
        'eslint/no-duplicate-imports': ['warn', { allowSeparateTypeImports: true }],
        'eslint/one-var': 'off',
        'eslint/max-statements': 'off',
        'unicorn/no-null': 'off',
        'eslint/max-lines': 'off',
        'import/prefer-default-export': 'off',
        'eslint/no-undefined': 'off',
        'eslint/no-plusplus': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/max-nested-calls': 'off',
        'eslint/no-continue': 'off',
        'import/exports-last': 'off',
        'eslint/default-case': 'off',
        'unicorn/switch-case-braces': ['warn', 'avoid'],
        'eslint/max-lines-per-function': 'off',
        'eslint/no-ternary': 'off',
        'typescript/no-confusing-void-expression': ['warn', { ignoreArrowShorthand: true }],
        'import/no-named-export': 'off',
        'typescript/no-inferrable-types': ['warn', { ignoreParameters: true }],
        'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
        'eslint/id-length': 'off',
        'eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        'eslint/curly': ['warn', 'multi', 'consistent'],

        // TODO: Fix, conflicts with sorting
        'eslint/sort-imports': 'off',
        // TODO: Enable for this file
        'eslint/sort-keys': 'off',
        // TODO: Consider enabling
        'import/group-exports': 'off',

        // Broken: doesn't seem to work
        'typescript/prefer-readonly-parameter-types': 'off',
    },
    overrides: [
        {
            files: ['**/*.mjs'],
            rules: {
                // 'eslint/sort-keys': ['warn', 'asc', { allowLineSeparatedGroups: true }],
                'eslint/sort-keys': 'warn',
                'unicorn/no-process-exit': 'off',

                // Types are not working properly for some reason
                'typescript/no-unsafe-call': 'off',
                'typescript/no-unsafe-member-access': 'off',

                // TODO: Figure out which to use
                'node/no-top-level-await': 'off',
                'unicorn/prefer-top-level-await': 'off',
            },
        },
        {
            files: ['backend/src/**/*.ts', 'common/src/**/*.ts'],
            rules: {
                'import/no-nodejs-modules': 'off',
                'eslint/no-console': 'off',
            },
        },
        {
            files: ['frontend/src/**/*.{ts,mts,tsx}'],
            rules: {
                'typescript/no-unsafe-type-assertion': 'off',
                'unicorn/filename-case': ['warn', { case: 'pascalCase' }],
                'import/no-relative-parent-imports': 'off',
                'react/jsx-max-depth': 'off',
                'react/jsx-no-literals': 'off',
                'react/react-in-jsx-scope': 'off',
                'react/jsx-handler-names': 'off',
                'react/jsx-filename-extension': ['warn', { extensions: ['jsx', 'tsx'] }],
                'eslint/no-alert': 'off',
                'react/forbid-component-props': 'off',
            },
        },
        // Allow camelcase for some frontend files
        {
            files: ['frontend/src/*.{ts,mts,tsx}'],
            rules: {
                'unicorn/filename-case': ['warn', { case: 'camelCase' }],
            },
        },
    ],
});
