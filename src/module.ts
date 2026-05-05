import { addComponent, addImportsDir, createResolver, defineNuxtModule } from "@nuxt/kit";

export interface TourOptions {
  /**
   * Prefix for the auto-registered component name. With the default "V" the component is `<VTour
   * />`.
   *
   * @default "V"
   */
  prefix?: string;
  /**
   * Inject the default tour.css file. Set to false if you want to provide your own stylesheet.
   *
   * @default true
   */
  injectCSS?: boolean;
  /**
   * Prefix used for localStorage keys.
   *
   * @default "nt"
   */
  storagePrefix?: string;
  /**
   * Global storage version. Bump this to force already-played tours to show again. Leave undefined
   * to disable version-based resets.
   */
  storageVersion?: string;
}

export default defineNuxtModule<TourOptions>({
  meta: {
    name: "nuxt-tour",
    configKey: "tour",
    compatibility: { nuxt: ">=3.0" },
  },
  moduleDependencies: {
    "@nuxt/icon": {},
  },
  defaults: {
    prefix: "V",
    injectCSS: true,
    storagePrefix: "nt",
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    const runtimeDir = resolver.resolve("./runtime");
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push("@popperjs/core");
    nuxt.options.alias["#nuxt-tour"] = runtimeDir;

    if (options.injectCSS) {
      nuxt.options.css.unshift(resolver.resolve("./runtime/css/tour.css"));
    }

    // Auto-import useTour composable
    addImportsDir(resolver.resolve("./runtime/composables"));

    // Optimise dev bundling
    nuxt.hook("vite:extendConfig", (config) => {
      config.optimizeDeps?.include?.push(
        "@popperjs/core",
        "@vueuse/integrations/useFocusTrap",
        "jump.js"
      );
    });

    addComponent({
      filePath: resolver.resolve("./runtime/components/Tour.vue"),
      name: options.prefix ? `${options.prefix}Tour` : "Tour",
    });
  },
});
