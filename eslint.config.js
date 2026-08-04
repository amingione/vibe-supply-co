import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        Blob: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        document: 'readonly',
        IntersectionObserver: 'readonly',
        process: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/jsx-uses-vars': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
