import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const nextRules = nextPlugin.configs['core-web-vitals'].rules

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      '.next',
      'out',
      'dist',
      'build',
      '.pnpm',
      'eslint.config.mjs',
      '**/*.config.{js,cjs,mjs,ts}',
      '**/*.config.*.js',
      // Test infrastructure
      'test/fixtures/**',
      'test-results/**',
      'playwright-report/**',
      'e2e-results/**',
      '.playwright/**',
      // Cache and build artifacts
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.cache/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...nextRules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  // Relaxed rules for test files
  {
    files: ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}', 'e2e/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  }
)
