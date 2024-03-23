export default defineNuxtConfig({
  modules: [
    "../src/module",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@nuxt/content",
  ],

  tour: { prefix: "V" },
  devtools: { enabled: true },
  tailwindcss: { exposeConfig: true },
  colorMode: { classSuffix: "" },
  typescript: { shim: false },
  imports: {
    imports: [
      { from: "tailwind-variants", name: "tv" },
      { from: "tailwind-variants", name: "VariantProps", type: true },
    ],
  },

  content: {
    documentDriven: true,
    markdown: {
      toc: { depth: 3 },
    },
    highlight: {
      langs: ["js", "ts", "html", "scss", "css", "json", "vue", "vue-html"],
      theme: {
        default: "material-theme-lighter",
        dark: "andromeeda",
      },
    },
    navigation: {
      fields: ["icon"],
    },
  },
});