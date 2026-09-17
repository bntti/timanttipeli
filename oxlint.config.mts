import { defineConfig } from 'oxlint';

// oxlint-disable eslint/sort-keys
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
    // oxlint-enable eslint/sort-keys
    rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
        'eslint/complexity': 'off',
        'eslint/curly': ['warn', 'multi', 'consistent'],
        'eslint/default-case': 'off',
        'eslint/id-length': 'off',
        'eslint/max-lines': 'off',
        'eslint/max-lines-per-function': 'off',
        'eslint/max-statements': 'off',
        'eslint/no-continue': 'off',
        'eslint/no-duplicate-imports': ['warn', { allowSeparateTypeImports: true }],
        'eslint/no-magic-numbers': 'off',
        'eslint/no-plusplus': 'off',
        'eslint/no-ternary': 'off',
        'eslint/no-undefined': 'off',
        'eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        'eslint/no-void': 'off',
        'eslint/no-warning-comments': 'off',
        'eslint/one-var': 'off',
        'eslint/sort-imports': 'off',
        'eslint/sort-keys': 'off',
        'import/exports-last': 'off',
        'import/group-exports': 'off',
        'import/max-dependencies': 'off',
        'import/no-default-export': 'off',
        'import/no-named-export': 'off',
        'import/prefer-default-export': 'off',
        'react/function-component-definition': ['warn', { namedComponents: 'arrow-function' }],
        'typescript/consistent-type-definitions': ['warn', 'type'],
        'typescript/no-confusing-void-expression': ['warn', { ignoreArrowShorthand: true }],
        'typescript/no-inferrable-types': ['warn', { ignoreParameters: true }],
        'typescript/prefer-readonly-parameter-types': 'off',
        'unicorn/max-nested-calls': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-null': 'off',
        'unicorn/switch-case-braces': ['warn', 'avoid'],
    },
    overrides: [
        {
            files: ['**/*.mts'],
            rules: {
                'eslint/no-console': 'off',
                'eslint/sort-keys': 'warn',
                'node/no-top-level-await': 'off',
                'unicorn/no-process-exit': 'off',
            },
        },
        {
            files: ['backend/src/**/*.ts', 'common/src/**/*.ts'],
            rules: {
                'eslint/no-console': 'off',
                'import/no-nodejs-modules': 'off',
            },
        },
        {
            files: ['frontend/src/**/*.{ts,mts,tsx}'],
            rules: {
                'eslint/no-alert': 'off',
                'import/no-relative-parent-imports': 'off',
                'react/forbid-component-props': 'off',
                'react/jsx-filename-extension': ['warn', { extensions: ['jsx', 'tsx'] }],
                'react/jsx-handler-names': 'off',
                'react/jsx-max-depth': 'off',
                'react/jsx-no-literals': 'off',
                'react/react-in-jsx-scope': 'off',
                'typescript/no-unsafe-type-assertion': 'off',
                'unicorn/filename-case': ['warn', { case: 'pascalCase' }],
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
