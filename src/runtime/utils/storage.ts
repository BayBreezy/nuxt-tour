import type { TourCompletionStatus, TourStorageEntry } from "../types";

const FALLBACK_PREFIX = "nt";

function getKey(prefix: string, name: string): string {
  return `${prefix}-${name}`;
}

function migrate(raw: unknown): TourStorageEntry {
  if (typeof raw === "boolean") {
    return {
      completed: raw,
      status: raw ? "completed" : null,
      completedAt: raw ? new Date().toISOString() : null,
      lastStep: 0,
      version: null,
    };
  }
  const entry = raw as Partial<TourStorageEntry>;
  return {
    completed: entry.completed ?? false,
    status: entry.status ?? null,
    completedAt: entry.completedAt ?? null,
    lastStep: entry.lastStep ?? 0,
    version: entry.version ?? null,
  };
}

export function readEntry(name: string, prefix = FALLBACK_PREFIX): TourStorageEntry {
  if (!import.meta.client) {
    return { completed: false, status: null, completedAt: null, lastStep: 0, version: null };
  }
  const key = getKey(prefix, name);
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return { completed: false, status: null, completedAt: null, lastStep: 0, version: null };
  }
  try {
    return migrate(JSON.parse(raw));
  } catch {
    return { completed: false, status: null, completedAt: null, lastStep: 0, version: null };
  }
}

export function writeEntry(
  name: string,
  patch: Partial<TourStorageEntry>,
  prefix = FALLBACK_PREFIX
): void {
  if (!import.meta.client) return;
  const key = getKey(prefix, name);
  const current = readEntry(name, prefix);
  localStorage.setItem(key, JSON.stringify({ ...current, ...patch }));
}

export function clearEntry(name: string, prefix = FALLBACK_PREFIX): void {
  if (!import.meta.client) return;
  localStorage.removeItem(getKey(prefix, name));
}

/** Returns true if the tour should be skipped (already played and not expired/outdated). */
export function shouldSkipTour(
  name: string,
  opts: { prefix?: string; version?: string | null; ttl?: number }
): boolean {
  const entry = readEntry(name, opts.prefix ?? FALLBACK_PREFIX);
  if (!entry.completed) return false;

  if (opts.version && entry.version !== opts.version) return false;

  if (opts.ttl && entry.completedAt) {
    const playedMs = new Date(entry.completedAt).getTime();
    const ttlMs = opts.ttl * 24 * 60 * 60 * 1000;
    if (Date.now() - playedMs > ttlMs) return false;
  }

  return true;
}

export function markComplete(
  name: string,
  status: TourCompletionStatus,
  opts: { prefix?: string; version?: string | null }
): void {
  writeEntry(
    name,
    {
      completed: true,
      status,
      completedAt: new Date().toISOString(),
      version: opts.version ?? null,
    },
    opts.prefix
  );
}

export function saveStepProgress(
  name: string,
  step: number,
  opts: { prefix?: string; version?: string | null }
): void {
  writeEntry(name, { lastStep: step, version: opts.version ?? null }, opts.prefix);
}

export function getResumeStep(name: string, prefix = FALLBACK_PREFIX): number {
  return readEntry(name, prefix).lastStep ?? 0;
}
