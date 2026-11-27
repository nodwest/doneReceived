import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Алиасы те же, что в tsconfig: без них тесты не могут загрузить модули,
// которые импортируют соседние слои по короткому пути (@shared/lib и т. п.).
const layer = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@app': layer('app'),
      '@pages': layer('pages'),
      '@widgets': layer('widgets'),
      '@features': layer('features'),
      '@entities': layer('entities'),
      '@shared': layer('shared'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
