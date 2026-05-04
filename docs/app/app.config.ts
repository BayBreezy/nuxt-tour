const repoBase = "https://github.com/BayBreezy/nuxt-tour";

export default defineAppConfig({
  docd: {
    github: {
      repo: repoBase,
      contentDir: "docs/content",
    },
    ui: {
      expandNav: true,
      extraLinks: [
        {
          label: "Star on GitHub",
          icon: "lucide:star",
          external: true,
          href: repoBase,
        },
        {
          icon: "lucide:bug",
          label: "Report an issue",
          external: true,
          href: `${repoBase}/issues/new?template=bug_report.yml`,
        },
        {
          icon: "lucide:lightbulb",
          label: "Feature request",
          external: true,
          href: `${repoBase}/issues/new?template=feature_request.yml`,
        },
        {
          icon: "lucide:coffee",
          label: "Buy me coffee",
          external: true,
          href: "https://buymeacoffee.com/llehXIrI8g",
        },
      ],
      header: {
        title: "Nuxt Tour",
        logo: {
          alt: "Nuxt Tour Logo",
          dark: "/icon.png",
          light: "/icon.png",
        },
      },
      transition: {
        name: "fade",
      },
    },
  },
});
