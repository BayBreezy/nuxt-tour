import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  features: {
    tooling: true,
  },
  // options here
})
  .override("nuxt/vue/rules", {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "vue/no-v-html": "off",
    },
    ignores: ["dist", "node_modules", ".nuxt"],
  })
  .override("nuxt/typescript/rules", {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-invalid-void-type": "off",
    },
  });
