import { addComponent, createResolver, defineNuxtModule, installModule } from "@nuxt/kit";

export interface TourOptions {
  /**
   * The prefix to use for the component name
   *
   * @default "V"
   */
  prefix?: string;
  /**
   * Inject the default sass file
   *
   * Feel free to create your own 🙂. Just get the class names correct
   *
   * @default true
   */
  injectSass?: boolean;
}

export default defineNuxtModule<TourOptions>({
  meta: {
    name: "nuxt-tour",
    configKey: "tour",
    compatibility: {
      nuxt: ">=3.0",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    prefix: "V",
    injectSass: true,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const runtimeDir = resolver.resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push("@popperjs/core");
    nuxt.options.alias["#nuxt-tour"] = runtimeDir;

    const isDevelopment = runtimeDir.endsWith("src/runtime") || runtimeDir.endsWith("src\\runtime");

    const extension = isDevelopment ? "scss" : "css";
    if (options.injectSass) {
      // add sass files to the top of the css array
      nuxt.options.css.unshift(resolver.resolve(`./runtime/scss/tour.${extension}`));
    }

    // install nuxt-icon module
    await installModule("@nuxt/icon");

    // optimize deps in dev mode
    if (isDevelopment) {
      nuxt.hook("vite:extendConfig", (config) => {
        config.optimizeDeps?.include?.push(
          "@popperjs/core",
          "@vueuse/integrations/useFocusTrap",
          "jump.js",
          "lodash-es"
        );
      });
    }

    addComponent({
      filePath: resolver.resolve("./runtime/components/Tour.vue"),
      name: options.prefix ? `${options.prefix}Tour` : "Tour",
    });
  },
});
