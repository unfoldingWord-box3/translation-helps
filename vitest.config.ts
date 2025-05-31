import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
    transformMode: {
      web: [/\.[jt]sx$/],
    },
    include: [
      'src/utils/**/*.{test,spec}.{ts,tsx}',
      'src/modules/**/tests/**/*.{test,spec}.ts',
      'src-new/utils/**/*.{test,spec}.js',
      'src-new/services/**/*.{test,spec}.js',
      'src-new/components/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
  },
});