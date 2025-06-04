import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.js",
    maxConcurrency: 1,
    testTimeout: 30000,
    hookTimeout: 30000,
    isolate: true,
    minThreads: 1,
    maxThreads: 1,

    include: [
      "src/utils/**/*.{test,spec}.{ts,tsx}",
      "src/modules/**/tests/**/*.{test,spec}.ts",
      "src-new/utils/**/*.{test,spec}.{js,jsx}",
      "src-new/hooks/**/*.{test,spec}.{js,jsx}",
      "src-new/services/**/*.{test,spec}.js",
      "src-new/components/**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.integration.test.*",
      "**/useAppState.test.jsx",
    ],
  },
});
