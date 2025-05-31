import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure js-yaml uses the browser-compatible version
    },
  },
  optimizeDeps: {
    include: ["js-yaml"], // Pre-bundle js-yaml
  },
});
