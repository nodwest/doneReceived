import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Проект на раннем этапе: слайсы пока используются в одном месте
    files: ['./src/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    // Общепринятые сегменты слоя app
    files: ['./src/app/providers/**', './src/app/styles/**'],
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
]);
