import Tour from "../src/module";

export default defineNuxtConfig({
  modules: [
    Tour,
    "nuxt-content-twoslash",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@nuxt/content",
  ],

  tour: { prefix: "V" },
  devtools: { enabled: true },
  tailwindcss: {
    exposeConfig: true,
    config: {
      plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
    },
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "last" }],
  },
  colorMode: { classSuffix: "" },
  typescript: { shim: false },

  imports: {
    imports: [
      { from: "tailwind-variants", name: "tv" },
      { from: "tailwind-variants", name: "VariantProps", type: true },
      { from: "vue-sonner", name: "toast", as: "useSonner" },
    ],
  },

  content: {
    documentDriven: true,
    markdown: {
      toc: { depth: 3 },
    },
    highlight: {
      langs: ["js", "ts", "html", "scss", "css", "json", "vue", "vue-html", "bash", "sh", "shell"],
      theme: {
        default: "min-light",
        dark: "night-owl",
      },
    },
    navigation: {
      fields: ["icon"],
    },
  },

  build: { transpile: ["vue-sonner"] },
});
