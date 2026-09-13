"use client";

import { useCallback, useSyncExternalStore } from "react";
import { fetchSnapshot, LeetCodeError } from "./leetcode";
import {
  clearSnapshot,
  loadSettings,
  loadSnapshot,
  loadSubmissions,
  mergeSubmissions,
  saveSettings,
  saveSnapshot,
} from "./storage";
import { applyTheme } from "./theme";
import { DEFAULT_SETTINGS, type AcSubmission, type LeetCodeSnapshot, type Settings } from "./types";

interface TrackerState {
  settings: Settings;
  snapshot: LeetCodeSnapshot | null;
  /** Every accepted submission seen across syncs, newest first. */
  submissions: AcSubmission[];
  hydrated: boolean;
  syncing: boolean;
  error: string | null;
}

// Module-level store shared by every component. Hydrated lazily from
// localStorage on the first client read so server and client markup match.
const SERVER_STATE: TrackerState = {
  settings: DEFAULT_SETTINGS,
  snapshot: null,
  submissions: [],
  hydrated: false,
  syncing: false,
  error: null,
};

let state: TrackerState = SERVER_STATE;
const listeners = new Set<() => void>();

function setState(patch: Partial<TrackerState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function getSnapshot() {
  if (!state.hydrated) {
    state = {
      ...state,
      settings: loadSettings(),
      snapshot: loadSnapshot(),
      submissions: loadSubmissions(),
      hydrated: true,
    };
  }
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateSettings(patch: Partial<Settings>) {
  const settings = { ...state.settings, ...patch };
  saveSettings(settings);
  if (patch.theme) applyTheme(patch.theme);
  // A different username means the cached snapshot belongs to someone else.
  if (patch.username !== undefined && patch.username !== state.settings.username) {
    clearSnapshot();
    setState({ settings, snapshot: null, submissions: [], error: null });
  } else {
    setState({ settings });
  }
}

/** Fetches a fresh snapshot. Resolves to true on success. */
export async function sync(username = state.settings.username): Promise<boolean> {
  if (!username || state.syncing) return false;
  setState({ syncing: true, error: null });
  try {
    const snapshot = await fetchSnapshot(username);
    saveSnapshot(snapshot);
    const submissions = mergeSubmissions(snapshot.recentAc);
    setState({ snapshot, submissions, syncing: false });
    return true;
  } catch (e) {
    setState({
      error: e instanceof LeetCodeError ? e.message : "Something went wrong while syncing.",
      syncing: false,
    });
    return false;
  }
}

/** Settings + cached LeetCode snapshot, plus sync controls. */
export function useTracker() {
  const s = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
  const syncNow = useCallback((username?: string) => sync(username), []);
  return { ...s, updateSettings, sync: syncNow };
}
