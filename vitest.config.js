import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: 'tests/**.test.ts',
    threads: false,
    environment: 'node',
    globals: false,
  },
});
