import { DEFAULT_SETTINGS, type AcSubmission, type LeetCodeSnapshot, type Settings } from "./types";

const KEYS = {
  settings: "dsa.settings",
  snapshot: "dsa.snapshot",
  submissions: "dsa.submissions",
} as const;

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...(read<Partial<Settings>>(KEYS.settings) ?? {}) };
}

export function saveSettings(settings: Settings) {
  write(KEYS.settings, settings);
}

export function loadSnapshot(): LeetCodeSnapshot | null {
  return read<LeetCodeSnapshot>(KEYS.snapshot);
}

export function saveSnapshot(snapshot: LeetCodeSnapshot) {
  write(KEYS.snapshot, snapshot);
}

export function clearSnapshot() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.snapshot);
  window.localStorage.removeItem(KEYS.submissions);
}

// LeetCode only exposes the 20 most recent accepted submissions, so we keep
// every one we've ever seen (keyed by id) to build up hour-of-day data over time.
export function loadSubmissions(): AcSubmission[] {
  return read<AcSubmission[]>(KEYS.submissions) ?? [];
}

export function mergeSubmissions(incoming: AcSubmission[]): AcSubmission[] {
  const byId = new Map(loadSubmissions().map((s) => [s.id, s]));
  for (const s of incoming) byId.set(s.id, s);
  const merged = [...byId.values()].sort((a, b) => b.timestamp - a.timestamp);
  write(KEYS.submissions, merged);
  return merged;
}
