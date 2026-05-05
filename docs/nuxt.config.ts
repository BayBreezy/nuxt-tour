export default defineNuxtConfig({
  extends: ["@baybreezy/docd"],
  modules: ["../src"],
  llms: {
    domain: process.env.NUXT_SITE_URL || "http://localhost:3000",
    title: process.env.NUXT_SITE_NAME || "Nuxt Tour",
    description: "Add interactive guided tours to your Nuxt app.",
    full: {
      title: process.env.NUXT_SITE_NAME || "Nuxt Tour",
      description: "Add interactive guided tours to your Nuxt app.",
    },
  },
  site: {
    url: process.env.NUXT_SITE_URL || "http://localhost:3000",
    name: process.env.NUXT_SITE_NAME || "Nuxt Tour",
  },
});
