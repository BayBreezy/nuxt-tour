import MyModule from "../../../src/module";

export default defineNuxtConfig({
  modules: [MyModule],
  tour: { prefix: "V", injectCSS: true, storagePrefix: "nt-test" },
});
