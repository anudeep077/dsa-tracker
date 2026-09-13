import type { LeetCodeSnapshot } from "./types";

export class LeetCodeError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Fetches a fresh snapshot via our proxy route. Throws LeetCodeError on failure. */
export async function fetchSnapshot(username: string): Promise<LeetCodeSnapshot> {
  const res = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}`, {
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new LeetCodeError(body.error ?? "Failed to reach LeetCode.", res.status);
  }
  return body as LeetCodeSnapshot;
}
