# Contributing to nuxt-tour

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3
- Node.js ≥ 20 (for tooling compatibility)
- Git

## Local development

```bash
# 1. Fork & clone
git clone https://github.com/BayBreezy/nuxt-tour.git
cd nuxt-tour

# 2. Install dependencies
bun install

# 3. Build the module stub (required before running docs or tests)
bun run dev:prepare

# 4. Start the docs dev server
bun run dev
```

The docs site (`docs/`) is a Nuxt app that imports the module locally — it's the primary way to manually test changes.

## Running tests

```bash
# Run all tests once
bun run test

# Watch mode
bun run test:watch

# Type-check everything
bun run test:types
```

Tests live in `test/` and use [Vitest](https://vitest.dev) + [`@nuxt/test-utils`](https://nuxt.com/docs/getting-started/testing).

## Code style

The project uses [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting and [oxfmt](https://github.com/nicholasgasior/oxfmt) for formatting.

```bash
# Lint
bun run lint

# Auto-fix lint issues
bun run lint:fix

# Format
bun run fmt

# Check formatting without writing
bun run fmt:check
```

Your editor will pick up the rules automatically if it supports ESLint / Prettier compatible formatters.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <short summary>

types: feat | fix | chore | docs | test | refactor | perf | style | ci
```

Examples:

```
feat: add saveToLocalStorage prop
fix: prevent useScrollLock crash in SSR
docs: document useTour composable
chore: bump @vueuse to v14.4.0
```

## Pull request checklist

- [ ] `bun run dev:prepare` completes without errors
- [ ] `bun run test` passes
- [ ] `bun run lint` passes
- [ ] `bun run fmt:check` passes
- [ ] `bun run test:types` passes
- [ ] New behaviour is covered by a test
- [ ] Breaking changes are called out in the PR description

## Project structure

```
src/
  module.ts                    # Nuxt module definition & options
  runtime/
    components/Tour.vue        # Main component
    composables/useTour.ts     # Public composable
    utils/
      storage.ts               # localStorage helpers
      popper.ts                # Popper.js factory
      scroll.ts                # Scroll utility (jump.js / scrollIntoView)
    css/tour.css               # Default styles (CSS custom properties)
    types.ts                   # All exported types
docs/                          # Documentation site (Nuxt + Docd)
test/                          # Vitest tests
```

## Releases

Releases are made by the maintainer via the **Release** GitHub Actions workflow (Actions → Release → Run workflow). You pick the bump type (`patch` / `minor` / `major` / `prerelease`) and the workflow handles changelogen, git tagging, and npm publishing with provenance.

## Getting help

Open a [Discussion](https://github.com/BayBreezy/nuxt-tour/discussions) for questions, or file an issue using the bug report / feature request templates.
