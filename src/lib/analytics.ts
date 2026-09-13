import type { AcSubmission } from "./types";

// LeetCode's submission calendar is keyed by UTC-midnight unix seconds, so all
// day arithmetic here is done in UTC to line up with those keys.
const DAY = 86400;

export interface DayPoint {
  /** UTC midnight, unix seconds */
  ts: number;
  /** e.g. "Sep 13" */
  label: string;
  count: number;
}

function utcMidnight(ms: number) {
  return Math.floor(ms / 1000 / DAY) * DAY;
}

export function dayLabel(ts: number, withYear = false) {
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
    timeZone: "UTC",
  });
}

/** Last `days` days (ending today, UTC) as a dense series. */
export function dailySeries(calendar: Record<string, number>, days = 30): DayPoint[] {
  const today = utcMidnight(Date.now());
  const out: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const ts = today - i * DAY;
    out.push({ ts, label: dayLabel(ts), count: calendar[String(ts)] ?? 0 });
  }
  return out;
}

export function average(series: DayPoint[]) {
  if (series.length === 0) return 0;
  return series.reduce((s, d) => s + d.count, 0) / series.length;
}

/** Highest-count day across the whole calendar; null if there's no activity. */
export function bestDay(calendar: Record<string, number>): DayPoint | null {
  let best: DayPoint | null = null;
  for (const [key, count] of Object.entries(calendar)) {
    if (!best || count > best.count) best = { ts: Number(key), label: dayLabel(Number(key), true), count };
  }
  return best;
}

export interface HourPoint {
  hour: number;
  label: string;
  count: number;
}

export function hourLabel(h: number) {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

/** 24 buckets of accepted submissions by local hour of day. */
export function hourHistogram(submissions: AcSubmission[]): HourPoint[] {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, label: hourLabel(hour), count: 0 }));
  for (const s of submissions) buckets[new Date(s.timestamp * 1000).getHours()].count++;
  return buckets;
}

export function peakHour(hist: HourPoint[]): HourPoint | null {
  const top = hist.reduce((a, b) => (b.count > a.count ? b : a), hist[0]);
  return top && top.count > 0 ? top : null;
}

// ---- Streaks ---------------------------------------------------------------

function utcToday() {
  return utcMidnight(Date.now());
}

/**
 * Consecutive active days ending today. If today has no activity yet the
 * streak is still alive, so we count back from yesterday instead.
 */
export function currentStreak(calendar: Record<string, number>): number {
  let ts = utcToday();
  if (!calendar[String(ts)]) ts -= DAY;
  let n = 0;
  while (calendar[String(ts)]) {
    n++;
    ts -= DAY;
  }
  return n;
}

/** Longest run of consecutive active days anywhere in the calendar. */
export function maxStreak(calendar: Record<string, number>): number {
  const days = Object.entries(calendar)
    .filter(([, c]) => c > 0)
    .map(([k]) => Number(k))
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && days[i] - days[i - 1] === DAY ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

// ---- Heatmap ---------------------------------------------------------------

export interface HeatmapCell {
  ts: number;
  count: number;
  /** 0 = no activity, 1–4 = quartile-ish intensity */
  level: number;
}

export interface HeatmapWeek {
  /** Label if this column starts a new month, else null */
  month: string | null;
  /** 7 entries, Sunday first; null = before the range starts */
  days: (HeatmapCell | null)[];
}

/** Trailing `weeks` weeks laid out GitHub-style: one column per week, Sunday first. */
export function heatmap(calendar: Record<string, number>, weeks = 52): HeatmapWeek[] {
  const today = utcToday();
  const todayDow = new Date(today * 1000).getUTCDay();
  // Column 0 begins on the Sunday `weeks` weeks before this week's Sunday.
  const start = today - todayDow * DAY - weeks * 7 * DAY;

  const max = Math.max(0, ...Object.values(calendar));
  const level = (count: number) => (count === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4)));

  const out: HeatmapWeek[] = [];
  let prevMonth = -1;
  for (let w = 0; w <= weeks; w++) {
    const weekStart = start + w * 7 * DAY;
    const days: (HeatmapCell | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const ts = weekStart + d * DAY;
      if (ts > today) break;
      const count = calendar[String(ts)] ?? 0;
      days.push({ ts, count, level: level(count) });
    }
    const month = new Date(weekStart * 1000).getUTCMonth();
    const label = month !== prevMonth && days.length >= 4 ? MONTHS[month] : null;
    prevMonth = month;
    out.push({ month: label, days });
  }
  return out;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
