# nuxt-tour docs

This is the documentation website for the [nuxt-tour](https://github.com/BayBreezy/nuxt-tour) Nuxt module. It is built with [Docd](https://github.com/BayBreezy/docd) and deployed to [nuxt-tour.behonbaker.com](https://nuxt-tour.behonbaker.com/).

## Development

```bash
# Install dependencies (from the repo root)
bun install

# Build the module stub first
bun run dev:prepare

# Start the docs dev server
bun run dev
```

Or start the docs site directly:

```bash
cd docs
bun install
bun run dev
```

## Structure

```
docs/
  content/           # Markdown pages (getting started, props, slots, examples…)
  components/        # Doc-site-specific Vue components
  public/            # Static assets
  nuxt.config.ts     # Extends @baybreezy/docd
```

## Deployment

The site is deployed automatically via Netlify on every push to `main`.
