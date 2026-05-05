# Agent Instructions — nuxt-tour

This file gives an AI agent the context needed to work effectively on this repo without re-deriving everything from scratch.

---

## What this repo is

**nuxt-tour** is a Nuxt module that lets developers add interactive guided tours to their apps. It ships:

- A `<VTour />` component (auto-registered, prefix configurable)
- A `useTour(name)` composable (auto-imported)
- A default stylesheet (`tour.css`) built with CSS custom properties

Package manager: **bun**. Do not use npm or yarn for installs.

---

## Essential commands

```bash
# Build the module stub (run this before anything else after a fresh clone)
bun run dev:prepare

# Start the docs dev server (docs/ is the playground for manual testing)
bun run dev

# Run all tests
bun run test

# Type-check
bun run test:types

# Lint
bun run lint

# Format
bun run fmt
```

---

## Directory layout

```
src/
  module.ts                      # Nuxt module entry — options, component + composable registration
  runtime/
    components/Tour.vue          # Main component (~300 lines)
    composables/useTour.ts       # Public composable — module-level Map registry
    utils/
      storage.ts                 # localStorage read/write/TTL/versioning/migration
      popper.ts                  # Popper.js factory + deepMerge helpers
      scroll.ts                  # scrollToTarget() wraps jump.js / scrollIntoView
    css/tour.css                 # Default styles — all CSS custom properties (--nt-*)
    types.ts                     # All exported types (TourConfig, TourStep, TourEmits, etc.)
docs/                            # Documentation site (Nuxt + Docd)
test/
  basic.test.ts                  # E2E: basic fixture
  multiStep.test.ts              # E2E: 3-step fixture
  storage.test.ts                # Unit: storage helpers (13 cases)
  composable.test.ts             # Unit: useTour composable (7 cases)
  fixtures/
    basic/                       # Single-step auto-start fixture
    multistep/                   # Three-step fixture (no auto-start)
    storage/                     # saveToLocalStorage: 'end' fixture
.github/
  workflows/ci.yml               # Lint + typecheck + test on push/PR
  workflows/release.yml          # Manual workflow_dispatch release to npm
  ISSUE_TEMPLATE/bug_report.yml
  ISSUE_TEMPLATE/feature_request.yml
CONTRIBUTING.md
AGENTS.md  ←  you are here
CLAUDE.md  →  symlink to AGENTS.md
```

---

## Module options (`nuxt.config.ts`)

```ts
tour: {
  prefix?: string          // Component name prefix. Default "V" → <VTour />
  injectCSS?: boolean      // Inject tour.css. Default true
  storagePrefix?: string   // localStorage key prefix. Default "nt"
  storageVersion?: string  // Bump to force re-show of played tours globally
}
```

---

## Types

All public types live in `src/runtime/types.ts` and are importable as:

```ts
import type { TourStep, TourConfig, TourEmits, TourStorageEntry } from "#nuxt-tour/types";
```

Key types:
- **`TourConfig`** — all component props (was `TourProps` in v0)
- **`TourStep`** — step definition
- **`ButtonConfig`** — button label + icons (was `ButtonProp` in v0)
- **`TourStorageEntry`** — localStorage schema `{ completed, status, completedAt, lastStep, version }`
- **`TourState`** — internal composable state held in the module-level Map

---

## Component — `Tour.vue`

Key decisions to know:

- **SSR safety**: every `window`/`localStorage` access is guarded by `import.meta.client`. `useScrollLock` is only called client-side.
- **Popper**: `createTourPopper()` from `utils/popper.ts` wraps Popper.js. The component calls `refreshPopper()` on each step transition.
- **Slot bindings**: all slots receive a single `slotProps` computed — do not duplicate bindings.
- **`data-hidden` attribute** controls visibility (CSS `display: none !important`). The `v-show` transition runs on top of that.
- **Backdrop**: `syncBackdrop()` is the single source of truth — call it after every step transition. The old code had duplicated logic that could leave the backdrop visible; this version does not.
- **Exposed**: `startTour`, `endTour`, `skipTour`, `nextStep`, `prevStep`, `goToStep`, `pause`, `resume`, `resetTour`, `recalculatePopper` (alias for `refreshPopper`), `isLocked`, `currentStep`, `isActive`

---

## Composable — `useTour(name, storagePrefix?)`

State is held in a module-level `Map<string, TourState>`. Both the component and external code access the same reactive object for a given `name`.

- `isPlayed` is a computed backed by `state._storageCompleted` (a reactive mirror of localStorage). **Do not read localStorage directly in computed** — Vue won't track it. Always go through `_storageCompleted`.
- When the component mounts it wires `_start`, `_end`, `_skip`, etc. onto the state. If `start()` is called before mount it sets `_pendingStart = true` and the component picks it up in `onMounted`.
- `markPlayed()` / `markUnplayed()` / `reset()` all update both localStorage and `_storageCompleted`.

---

## Storage (`utils/storage.ts`)

Schema stored as JSON under key `{storagePrefix}-{name}`:

```ts
{
  completed: boolean
  status: 'completed' | 'skipped' | null
  completedAt: string | null   // ISO date — TTL comparison
  lastStep: number             // resume index for saveToLocalStorage: 'step'
  version: string | null       // matches TourOptions.storageVersion
}
```

Old boolean values are **migrated automatically** in `readEntry()` — no manual migration needed.

`shouldSkipTour()` returns `true` only when:
1. `completed === true`, AND
2. `version` matches (if a version is configured), AND
3. `completedAt` is within the `ttl` window (if ttl is configured)

---

## Styling

All styles are in `src/runtime/css/tour.css`. There is **no Sass**. The `sass` package has been removed.

CSS custom properties are declared on `#nt-tooltip`:

```css
#nt-tooltip {
  --nt-bg: #ffffff;
  --nt-text: #0f172a;
  --nt-btn-bg: #020617;
  /* … */
}
```

Users override them by targeting `#nt-tooltip` in their own CSS. There is no need to eject or copy the stylesheet.

---

## Tests

- `test/storage.test.ts` and `test/composable.test.ts` are **plain Vitest unit tests** — they import source files directly and run without a Nuxt server. They rely on `vitest.config.ts` which:
  - Defines `import.meta.client = true`
  - Aliases `#imports` → `vue`
  - Provides a `localStorage` mock inside each test file

- `test/basic.test.ts` and `test/multiStep.test.ts` are **E2E tests** using `@nuxt/test-utils/e2e`. They spin up a real Nuxt server and use `$fetch`. These are slower (~4 s each).

- SSR only renders the **active step** (index 0) — do not write E2E assertions that expect step 1+ content to appear in the initial HTML.

---

## Emits (breaking change from v0)

| v0 | v1 |
|---|---|
| `onTourStart` | `tour:start` |
| `onTourEnd` | `tour:end` |
| — | `tour:skip` |
| — | `tour:step-change` (`{ from, to }`) |

`props.onComplete` and `props.onSkip` callbacks have been **removed** — use `@tour:end` and `@tour:skip` instead.

---

## Other breaking changes from v0

| v0 | v1 |
|---|---|
| `injectSass` module option | `injectCSS` |
| `#nuxt-tour/props` import | `#nuxt-tour/types` |
| `TourProps` type | `TourConfig` type |
| `ButtonProp` type | `ButtonConfig` type |
| localStorage `boolean` | object with `completed`, `status`, `completedAt`, `lastStep`, `version` |

---

## Release process

Releases are done via the **Release** GitHub Actions workflow — not from the command line. Navigate to Actions → Release → Run workflow, pick the bump type (`patch` / `minor` / `major` / `prerelease`), and click Run. The workflow runs changelogen, pushes the tag, and publishes to npm with provenance.

You will need an `NPM_TOKEN` secret configured in the repo settings for publishing to work.

---

## Code conventions

- Formatter: **oxfmt** — run `bun run fmt` before committing
- Linter: **oxlint** — run `bun run lint` before committing
- Commit style: [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- No comments in code unless the WHY is non-obvious
- No `lodash-es` — it has been removed; use native spread / `Object.assign` for merging
- No Sass — pure CSS only
- Keep `import.meta.client` guards on any code that touches `window`, `document`, or `localStorage`
