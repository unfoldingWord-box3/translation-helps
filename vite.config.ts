import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // REMOVE: 'yaml': 'yaml/browser/index.js'
    },
  },
  optimizeDeps: {
    // include: ["yaml"], // REMOVE 'yaml/browser'
  },
});
