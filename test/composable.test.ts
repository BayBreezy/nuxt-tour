import { beforeEach, describe, expect, it } from "vitest";

import { useTour } from "../src/runtime/composables/useTour";
import { markComplete } from "../src/runtime/utils/storage";

const PREFIX = "nt";
const NAME = "composable-test";

// Minimal localStorage mock
const store: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  },
  writable: true,
});
Object.defineProperty(import.meta, "client", { value: true, writable: true });

beforeEach(() => {
  localStorage.clear();
});

describe("useTour composable", () => {
  it("isPlayed returns false when no entry exists", () => {
    const { isPlayed } = useTour(NAME, PREFIX);
    expect(isPlayed.value).toBe(false);
  });

  it("isPlayed returns true after markPlayed()", () => {
    const { markPlayed } = useTour(NAME, PREFIX);
    markPlayed();
    // Re-read from storage (computed is lazy in this environment)
    const { isPlayed: isPlayed2 } = useTour(NAME, PREFIX);
    expect(isPlayed2.value).toBe(true);
  });

  it("markUnplayed clears the entry", () => {
    markComplete(NAME, "completed", { prefix: PREFIX, version: null });
    const { isPlayed, markUnplayed } = useTour(NAME, PREFIX);
    expect(isPlayed.value).toBe(true);
    markUnplayed();
    expect(isPlayed.value).toBe(false);
  });

  it("lastPlayedAt is null before tour is played", () => {
    const { lastPlayedAt } = useTour(NAME + "-fresh", PREFIX);
    expect(lastPlayedAt.value).toBeNull();
  });

  it("lastPlayedAt returns a Date after completion", () => {
    markComplete(NAME + "-dated", "completed", { prefix: PREFIX, version: null });
    const { lastPlayedAt } = useTour(NAME + "-dated", PREFIX);
    expect(lastPlayedAt.value).toBeInstanceOf(Date);
  });

  it("completionStatus reflects skipped status", () => {
    markComplete(NAME + "-skipped", "skipped", { prefix: PREFIX, version: null });
    const { completionStatus } = useTour(NAME + "-skipped", PREFIX);
    expect(completionStatus.value).toBe("skipped");
  });

  it("queues pending start when _start is not yet wired", async () => {
    const { start, _state } = useTour(NAME + "-pending", PREFIX);
    expect(_state._pendingStart).toBeUndefined();
    await start(); // no component mounted, should set _pendingStart
    expect(_state._pendingStart).toBe(true);
  });
});
