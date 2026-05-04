import { computed, reactive } from "vue";

import type { TourState } from "../types";
import { clearEntry, markComplete, readEntry } from "../utils/storage";

/** Module-level registry — one entry per tour name. */
const registry = new Map<string, TourState>();

function getOrCreate(name: string, storagePrefix: string): TourState {
  if (!registry.has(name)) {
    const initial = import.meta.client ? readEntry(name, storagePrefix).completed : false;
    registry.set(
      name,
      reactive<TourState>({
        isActive: false,
        isPaused: false,
        currentStep: 0,
        totalSteps: 0,
        _storageCompleted: initial,
      })
    );
  }
  return registry.get(name)!;
}

export function useTour(name: string, storagePrefix = "nt") {
  const state = getOrCreate(name, storagePrefix);

  const isPlayed = computed(() => state._storageCompleted);

  const lastPlayedAt = computed<Date | null>(() => {
    if (!import.meta.client) return null;
    const at = readEntry(name, storagePrefix).completedAt;
    return at ? new Date(at) : null;
  });

  const completionStatus = computed(() => {
    if (!import.meta.client) return null;
    return readEntry(name, storagePrefix).status;
  });

  const progress = computed(() =>
    state.totalSteps > 0 ? (state.currentStep + 1) / state.totalSteps : 0
  );

  function markPlayed() {
    markComplete(name, "completed", { prefix: storagePrefix });
    state._storageCompleted = true;
  }

  function markUnplayed() {
    clearEntry(name, storagePrefix);
    state._storageCompleted = false;
  }

  async function start() {
    if (state._start) {
      await state._start();
    } else {
      state._pendingStart = true;
    }
  }

  async function end() {
    await state._end?.();
  }

  async function skip() {
    await state._skip?.();
  }

  async function next() {
    await state._next?.();
  }

  async function prev() {
    await state._prev?.();
  }

  async function goTo(step: number) {
    await state._goTo?.(step);
  }

  function pause() {
    state._pause?.();
  }

  function resume() {
    state._resume?.();
  }

  async function reset() {
    clearEntry(name, storagePrefix);
    state._storageCompleted = false;
    await state._reset?.();
  }

  return {
    // Read-only reactive state
    isActive: computed(() => state.isActive),
    isPaused: computed(() => state.isPaused),
    currentStep: computed(() => state.currentStep),
    totalSteps: computed(() => state.totalSteps),
    progress,
    // Storage-backed
    isPlayed,
    lastPlayedAt,
    completionStatus,
    // Storage helpers (usable before component mounts)
    markPlayed,
    markUnplayed,
    // Controls
    start,
    end,
    skip,
    next,
    prev,
    goTo,
    pause,
    resume,
    reset,
    /** Internal — used by Tour.vue to wire its methods into the registry. */
    _state: state,
  };
}
