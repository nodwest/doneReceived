// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'node_modules/*',
      'obsidian-done/**',
      'canvases/**',
      'src/entities/family-event/api/generated/**',
    ],
  },
  {
    // У vitest только поле `exports`, резолвер eslint-plugin-import его не
    // читает; tsc проверяет этот импорт сам.
    files: ['**/*.test.ts', 'vitest.config.mts'],
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^vitest'] }],
    },
  },
]);
