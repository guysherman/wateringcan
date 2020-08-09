module.exports = {
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
            },
        },
    },
    env: {
        browser: true,
        es2020: true,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:css-modules/recommended',
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
        'css-modules',
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
        'react/jsx-indent': [1, 4, { checkAttributes: true, indentLogicalExpressions: true }],
        'import/extensions': 'off',
        'arrow-body-style': 'off',
        'no-param-reassign': 'off',
        'jsx-a11y/label-has-for': [1, {
            components: ['Label'],
            required: {
                every: ['id'],
            },
            allowChildren: false,
        }],
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            rules: {
                'no-unused-vars': ['off'],
                'no-undef': ['off'],
                '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
            },
        },
    ],
};
