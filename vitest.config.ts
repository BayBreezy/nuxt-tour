import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    // Make storage / composable utils behave as if running in the browser
    "import.meta.client": JSON.stringify(true),
    "import.meta.server": JSON.stringify(false),
  },
  resolve: {
    alias: {
      // Nuxt's virtual module — redirect to vue for plain unit tests
      "#imports": "vue",
    },
  },
});
