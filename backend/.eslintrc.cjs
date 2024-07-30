module.exports = {
    env: { node: true },
    extends: ['plugin:@typescript-eslint/recommended-type-checked', '../.eslintrc.cjs'],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['node_modules', 'dist', '.eslintrc.cjs'],
    settings: {
        'import/resolver': {
            typescript: { project: `${__dirname}/` }, // this loads <rootdir>/tsconfig.json to eslint
        },
    },
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'error',
    },
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
};
