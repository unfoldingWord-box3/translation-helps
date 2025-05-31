import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: [
      'src/utils/**/*.{test,spec}.{ts,tsx}',
      'src/modules/**/tests/**/*.{test,spec}.ts',
      'src-new/utils/**/*.{test,spec}.js',
      'src-new/services/twlService.test.js'
    ],
  },
});