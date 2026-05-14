import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/game/**'],
      exclude: ['lib/game/__tests__/**'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 70, functions: 70 },
    },
  },
});
