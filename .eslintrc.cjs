module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'google',
        'prettier',
        'plugin:prettier/recommended',
    ],
    plugins: ['import'],
    ignorePatterns: ['.eslintrc.cjs'],
    rules: {
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
        '@typescript-eslint/no-useless-template-literals': 'warn',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'error',
        'import/prefer-default-export': 'off',
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
    },
};
