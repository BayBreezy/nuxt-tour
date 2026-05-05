import type { Modifier, OptionsGeneric } from "@popperjs/core";
import type { Options as JumpOptions } from "jump.js";
import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";

// ─── Storage ─────────────────────────────────────────────────────────────────

export type TourCompletionStatus = "completed" | "skipped" | null;

export interface TourStorageEntry {
  completed: boolean;
  status: TourCompletionStatus;
  /** ISO date string — used for TTL comparison. */
  completedAt: string | null;
  /** Last step index the user reached — used to resume when saveToLocalStorage: 'step' */
  lastStep: number;
  /** Snapshot of TourOptions.storageVersion at time of completion. */
  version: string | null;
}

// ─── Step ─────────────────────────────────────────────────────────────────────

export type TourStep = {
  /**
   * CSS selector, HTMLElement, or reactive ref/getter. Omit (or set null/undefined) to centre the
   * tooltip on screen.
   */
  target?: string | null | undefined | MaybeRefOrGetter<string> | ComputedRef<string> | HTMLElement;
  title?: string | HTMLElement | Ref<HTMLElement> | Ref<string> | null;
  subText?: string | HTMLElement | Ref<HTMLElement> | Ref<string> | null;
  body?: string | HTMLElement | Ref<HTMLElement> | Ref<string> | null;
  /** Per-step Popper.js config, deep-merged over the tour default. */
  popperConfig?: Partial<OptionsGeneric<Partial<Modifier<any, any>>>>;
  /** Called before the step is shown. Return false to abort the step transition. */
  onShow?: () => void | boolean | Promise<void | boolean>;
  /** Called when Next is clicked on this step. */
  onNext?: () => void | Promise<void>;
  /** Called when Prev is clicked on this step. */
  onPrev?: () => void | Promise<void>;
  /** Slot-name prefix for this step's custom slots. */
  slot?: string;
  /** Show a backdrop on this step (overrides the tour-level `backdrop` prop). */
  backdrop?: boolean;
  /** Tooltip transition for this step. Overrides the tour-level `transition` prop. */
  transition?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right";
};

// ─── Buttons ──────────────────────────────────────────────────────────────────

export type ButtonConfig = {
  label?: string;
  /** Icon name from https://icones.netlify.app — rendered to the left of the label. */
  leftIcon?: string;
  /** Icon name from https://icones.netlify.app — rendered to the right of the label. */
  rightIcon?: string;
};

// ─── Tour config (component props) ───────────────────────────────────────────

export type TourConfig = {
  /**
   * Unique name for this tour. Used as the localStorage key suffix.
   *
   * @default "default"
   */
  name?: string;
  /** Array of step definitions. At least one step is required. */
  steps: TourStep[];
  /**
   * Controls when (and whether) tour progress is persisted to localStorage.
   *
   * - `'end'` — save only when the tour is fully completed (default)
   * - `'step'` — save after each step; allows resuming mid-tour on next visit
   * - `'never'` — never persist; tour always shows on every page load
   *
   * @default "end"
   */
  saveToLocalStorage?: "never" | "step" | "end";
  /** How many days a completed tour stays hidden before showing again. Omit for no expiry. */
  ttl?: number;
  /**
   * Start the tour automatically when the component mounts.
   *
   * @default false
   */
  autoStart?: boolean;
  /**
   * Milliseconds to wait before showing the first step when autoStart is true.
   *
   * @default 100
   */
  startDelay?: number | string | null;
  /** Highlight the target element with an outline while on that step. */
  highlight?: boolean;
  /** Show a semi-transparent backdrop behind the tooltip. */
  backdrop?: boolean;
  /**
   * Show the popper arrow.
   *
   * @default true
   */
  showArrow?: boolean;
  /**
   * Show a "Step N of M" progress counter inside the tooltip.
   *
   * @default false
   */
  showProgress?: boolean;
  /**
   * Enable keyboard navigation: → / ↓ next, ← / ↑ prev, Escape end.
   *
   * @default true
   */
  keyboard?: boolean;
  /**
   * Scroll behaviour when moving between steps. - `'jump'` — use jump.js smooth scroll (default) -
   * `'smooth'` — native scrollIntoView with smooth behaviour - `'none'` — no scrolling.
   *
   * @default "jump"
   */
  scrollBehavior?: "jump" | "smooth" | "none";
  /**
   * Trap keyboard focus inside the tooltip while active.
   *
   * @default true
   */
  trapFocus?: boolean;
  /**
   * Prevent the page from scrolling while the tour is active.
   *
   * @default true
   */
  lockScroll?: boolean;
  /** Jump.js configuration, merged with the module default. */
  jumpOptions?: JumpOptions;
  /**
   * Tooltip enter/leave animation.
   *
   * - `'fade'` — opacity + slight scale (default)
   * - `'slide-up'` — slides upward into view
   * - `'slide-down'` — slides downward into view
   * - `'slide-left'` — slides in from the right
   * - `'slide-right'` — slides in from the left
   *
   * @default "fade"
   */
  transition?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right";
  nextButton?: ButtonConfig;
  prevButton?: ButtonConfig;
  skipButton?: ButtonConfig;
  finishButton?: ButtonConfig;
};

// ─── Emits ────────────────────────────────────────────────────────────────────

export type TourEmits = {
  "tour:start": [];
  "tour:end": [];
  "tour:skip": [];
  "tour:step-change": [{ from: number; to: number }];
};

// ─── Composable state ─────────────────────────────────────────────────────────

export interface TourState {
  isActive: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  /** Reactive mirror of the localStorage completed flag — updated on every storage write. */
  _storageCompleted: boolean;
  // Wired in by the component once mounted
  _start?: () => Promise<void>;
  _end?: () => Promise<void>;
  _skip?: () => Promise<void>;
  _next?: () => Promise<void>;
  _prev?: () => Promise<void>;
  _goTo?: (step: number) => Promise<void>;
  _pause?: () => void;
  _resume?: () => void;
  _reset?: () => Promise<void>;
  /** Pending start call queued before the component mounted. */
  _pendingStart?: boolean;
}
