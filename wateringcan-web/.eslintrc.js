module.exports = {
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    env: {
        browser: true,
        es2020: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 11,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
        'react/jsx-indent': [1, 4, { checkAttributes: true, indentLogicalExpressions: true }],
        'import/extensions': ['error', 'never'],
    },
};
