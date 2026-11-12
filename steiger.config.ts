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
    // Страница — экран приложения, фича — действие пользователя: их больше
    // 20, и группировать их в папки пока не нужно
    files: ['./src/pages/**', './src/features/**'],
    rules: {
      'fsd/excessive-slicing': 'off',
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
