import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: 'test/**.test.ts',
    threads: false,
    environment: 'node',
    globals: false,
  },
});
