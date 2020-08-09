module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    extends: [
        'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 11,
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        indent: ['error', 4],
        'import/extensions': 'off',
        'arrow-body-style': 'off',
    },
    overrides: [
        {
            files: ['**/*.ts'],
            rules: {
                'no-unused-vars': ['off'],
                'no-undef': ['off'],
                '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
            },
        },
    ],
};
