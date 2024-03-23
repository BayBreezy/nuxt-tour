<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt Tour
- Package name: nuxt-tour
- Description: Empower your users with interactive guided tours of your Nuxt 3 applications using the nuxt-tour module. With this versatile tool, developers can seamlessly integrate step-by-step tooltips and popovers into their applications, providing clear instructions and highlighting key features.
-->

# Nuxt Tour

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Empower your users with interactive guided tours of your Nuxt 3 applications using the `nuxt-tour` module.

With this module, developers can seamlessly integrate step-by-step tooltips into their applications, providing clear instructions and highlighting key features.

Special thanks to [Vue Tour](https://github.com/GlobalHive/vuejs-tour/tree/master) for doing the heavy lifting. I basically just ported it to Nuxt 3(with a few changes here and there).

Thank you https://github.com/GlobalHive

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-tour?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->

- **Easy Integration**: Quickly add guided tours to your Nuxt 3 projects with minimal setup.
- **Customizable**: Tailor the appearance of steps to match your application's design and user experience.
- **Step-by-Step Navigation**: Guide users through workflows and features with sequential tooltips and intuitive navigation controls.
- **Rich Content Support**: Enhance tooltips with text, images, videos, and interactive elements through the provided slots.
- **Responsive Design**: Ensure a consistent experience across devices with responsive tooltips that adapt to different screen sizes.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npm install nuxt-tour
```

Then, add the module to your `nuxt.config` file:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-tour"],
});
```

You can then pass a `prefix` to the module via the `tour` key in your `nuxt.config` file. You can also pass the `injectSass` key to inject the default styles into your application:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-tour"],
  tour: {
    prefix: "tour",
  },
});
```

## Configure the module

You can configure the module by passing the following options to the `tour` key in your `nuxt.config` file:

```ts
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
```

That's it! You can now use Nuxt Tour in your Nuxt app ✨

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-tour/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-tour
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-tour.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-tour
[license-src]: https://img.shields.io/npm/l/nuxt-tour.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-tour
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
