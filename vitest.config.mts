import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Алиасы `@entities/*` и др. — из tsconfig, как в приложении.
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
