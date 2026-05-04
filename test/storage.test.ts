import { beforeEach, describe, expect, it } from "vitest";

import {
  clearEntry,
  getResumeStep,
  markComplete,
  readEntry,
  saveStepProgress,
  shouldSkipTour,
  writeEntry,
} from "../src/runtime/utils/storage";

const PREFIX = "nt-test";
const NAME = "test-tour";

// Provide a minimal localStorage mock for the Node test environment
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

// Let import.meta.client resolve to true in tests
Object.defineProperty(import.meta, "client", { value: true, writable: true });

beforeEach(() => {
  localStorage.clear();
});

describe("readEntry / writeEntry", () => {
  it("returns a blank entry when nothing is stored", () => {
    const entry = readEntry(NAME, PREFIX);
    expect(entry.completed).toBe(false);
    expect(entry.status).toBeNull();
    expect(entry.lastStep).toBe(0);
  });

  it("round-trips a written entry", () => {
    writeEntry(
      NAME,
      { completed: true, status: "completed", completedAt: "2025-01-01T00:00:00.000Z" },
      PREFIX
    );
    const entry = readEntry(NAME, PREFIX);
    expect(entry.completed).toBe(true);
    expect(entry.status).toBe("completed");
  });
});

describe("migration from boolean format", () => {
  it("migrates a raw true boolean to the new schema", () => {
    localStorage.setItem(`${PREFIX}-${NAME}`, "true");
    const entry = readEntry(NAME, PREFIX);
    expect(entry.completed).toBe(true);
    expect(entry.status).toBe("completed");
  });

  it("migrates a raw false boolean to the new schema", () => {
    localStorage.setItem(`${PREFIX}-${NAME}`, "false");
    const entry = readEntry(NAME, PREFIX);
    expect(entry.completed).toBe(false);
    expect(entry.status).toBeNull();
  });
});

describe("shouldSkipTour", () => {
  it("returns false when nothing is stored", () => {
    expect(shouldSkipTour(NAME, { prefix: PREFIX })).toBe(false);
  });

  it("returns true for a completed tour with no TTL or version", () => {
    markComplete(NAME, "completed", { prefix: PREFIX, version: null });
    expect(shouldSkipTour(NAME, { prefix: PREFIX })).toBe(true);
  });

  it("returns false when version does not match", () => {
    markComplete(NAME, "completed", { prefix: PREFIX, version: "v1" });
    expect(shouldSkipTour(NAME, { prefix: PREFIX, version: "v2" })).toBe(false);
  });

  it("returns true when version matches", () => {
    markComplete(NAME, "completed", { prefix: PREFIX, version: "v2" });
    expect(shouldSkipTour(NAME, { prefix: PREFIX, version: "v2" })).toBe(true);
  });

  it("returns false when TTL has expired", () => {
    // completedAt 2 days ago, TTL 1 day
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    writeEntry(NAME, { completed: true, status: "completed", completedAt: twoDaysAgo }, PREFIX);
    expect(shouldSkipTour(NAME, { prefix: PREFIX, ttl: 1 })).toBe(false);
  });

  it("returns true when within TTL", () => {
    writeEntry(
      NAME,
      { completed: true, status: "completed", completedAt: new Date().toISOString() },
      PREFIX
    );
    expect(shouldSkipTour(NAME, { prefix: PREFIX, ttl: 7 })).toBe(true);
  });
});

describe("saveToLocalStorage: 'step' behaviour", () => {
  it("saves step progress and can be read back", () => {
    saveStepProgress(NAME, 2, { prefix: PREFIX, version: null });
    expect(getResumeStep(NAME, PREFIX)).toBe(2);
  });

  it("returns 0 when no progress is saved", () => {
    expect(getResumeStep(NAME, PREFIX)).toBe(0);
  });
});

describe("clearEntry", () => {
  it("removes the entry so shouldSkipTour returns false", () => {
    markComplete(NAME, "completed", { prefix: PREFIX, version: null });
    expect(shouldSkipTour(NAME, { prefix: PREFIX })).toBe(true);
    clearEntry(NAME, PREFIX);
    expect(shouldSkipTour(NAME, { prefix: PREFIX })).toBe(false);
  });
});
