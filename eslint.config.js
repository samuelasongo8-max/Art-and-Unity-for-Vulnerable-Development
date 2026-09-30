import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Vercel serverless functions in /api run on Node, not in the browser, so
    // they see `process.env` rather than `window`. Everything above applies to
    // them too (recommended rules, module parsing).
    files: ['api/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // lib/ is server-only too — it is imported by /api functions and by the
    // one-time scripts in /scripts, both of which run on Node. Without this the
    // browser globals above would flag process.env as undefined in these files.
    files: ['lib/**/*.js', 'scripts/**/*.js', 'scripts/**/*.mjs', 'server/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
