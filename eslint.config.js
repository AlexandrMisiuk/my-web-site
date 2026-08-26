import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import testingLibrary from 'eslint-plugin-testing-library';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'dist',
            'node_modules',
            '.junie',
            '.agents',
            '.claude',
            '.idea',
            'docs',
            'public',
            'coverage',
            'playwright-report',
            'test-results',
        ],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            ...jsxA11y.configs.recommended.rules,
        },
    },
    {
        ...testingLibrary.configs['flat/react'],
        files: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**'],
        rules: {
            ...testingLibrary.configs['flat/react'].rules,
            'react-refresh/only-export-components': 'off',
            'testing-library/no-manual-cleanup': 'off',
        },
    },
    {
        ...playwright.configs['flat/recommended'],
        files: ['e2e/**', 'playwright.config.ts'],
        languageOptions: {
            globals: globals.node,
        },
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/no-skipped-test': 'off',
            'react-hooks/rules-of-hooks': 'off',
        },
    },
);
