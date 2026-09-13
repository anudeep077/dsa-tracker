export type Difficulty = "Easy" | "Medium" | "Hard";

export interface DifficultyCount {
  difficulty: "All" | Difficulty;
  count: number;
}

export interface TagCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface AcSubmission {
  id: string;
  title: string;
  titleSlug: string;
  /** Unix seconds */
  timestamp: number;
}

/** Normalized snapshot returned by /api/leetcode */
export interface LeetCodeSnapshot {
  username: string;
  realName: string | null;
  avatar: string | null;
  ranking: number | null;
  solved: Record<"All" | Difficulty, number>;
  total: Record<"All" | Difficulty, number>;
  /** Unix-seconds (UTC midnight) -> submission count */
  calendar: Record<string, number>;
  streak: number;
  totalActiveDays: number;
  tags: TagCount[];
  recentAc: AcSubmission[];
  /** ISO string of when this snapshot was fetched */
  fetchedAt: string;
}

export type Theme = "system" | "light" | "dark";

export interface Settings {
  username: string;
  goal: number;
  theme: Theme;
}

export const DEFAULT_SETTINGS: Settings = { username: "", goal: 500, theme: "system" };
