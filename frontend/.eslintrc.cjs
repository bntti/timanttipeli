module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:react-hooks/recommended',
        '../.eslintrc.cjs',
    ],
    ignorePatterns: ['node_modules', 'dist', '.eslintrc.cjs', 'vite.config.ts'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react-refresh'],
    settings: {
        'import/resolver': {
            typescript: { project: `${__dirname}/` }, // this loads <rootdir>/tsconfig.json to eslint
        },
    },
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        '@typescript-eslint/no-misused-promises': [
            'warn',
            { checksVoidReturn: { attributes: false } }, // To allow async onClick
        ],
    },
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
};
