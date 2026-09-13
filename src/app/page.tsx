"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { currentStreak } from "@/lib/analytics";
import { DailyActivity } from "@/components/DailyActivity";
import { DifficultyBreakdown } from "@/components/DifficultyBreakdown";
import { ErrorBanner } from "@/components/ErrorBanner";
import { GoalProgress } from "@/components/GoalProgress";
import { Header } from "@/components/Header";
import { CheckCircleIcon, FlameIcon, TrophyIcon } from "@/components/icons";
import { RecentSolves } from "@/components/RecentSolves";
import { Heatmap } from "@/components/Heatmap";
import { StatCard } from "@/components/StatCard";
import { Streaks } from "@/components/Streaks";
import { TopicBreakdown } from "@/components/TopicBreakdown";
import { useTracker } from "@/lib/useTracker";

export default function Dashboard() {
  const { settings, snapshot, submissions, hydrated, syncing, error, sync } = useTracker();
  const autoSynced = useRef(false);

  // First visit with a username but no cached data: sync automatically once.
  useEffect(() => {
    if (hydrated && settings.username && !snapshot && !autoSynced.current) {
      autoSynced.current = true;
      sync();
    }
  }, [hydrated, settings.username, snapshot, sync]);

  if (!hydrated) return null;

  const streak = snapshot ? currentStreak(snapshot.calendar) : 0;

  if (!settings.username) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to DSA Tracker</h1>
        <p className="mt-2 text-sm text-muted">
          You solve problems on LeetCode.com as usual — this dashboard reads your public profile and turns it into
          stats, streaks, and charts. Nothing to install, no login here.
        </p>
        <ol className="mt-8 space-y-4 text-left text-sm">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fg text-xs font-medium text-page">
              1
            </span>
            <span className="text-muted">
              Solve problems on <span className="text-fg">leetcode.com</span> like you normally would.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fg text-xs font-medium text-page">
              2
            </span>
            <span className="text-muted">
              Enter your <span className="text-fg">LeetCode username</span> in Settings — that&apos;s the only setup.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fg text-xs font-medium text-page">
              3
            </span>
            <span className="text-muted">
              Come back here and hit <span className="text-fg">Sync now</span> whenever you want fresh numbers.
            </span>
          </li>
        </ol>
        <Link
          href="/settings"
          className="mt-8 inline-block rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-page hover:opacity-80"
        >
          Get started →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Header snapshot={snapshot} username={settings.username} syncing={syncing} onSync={() => sync()} />

      {error && <ErrorBanner message={error} onRetry={() => sync()} retrying={syncing} />}

      {!snapshot && !error && <p className="text-sm text-muted">Fetching your stats…</p>}

      {snapshot && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<CheckCircleIcon />}
              label="Total solved"
              value={snapshot.solved.All}
              hint={`of ${snapshot.total.All} problems`}
            />
            <StatCard
              icon={<TrophyIcon />}
              label="Ranking"
              value={snapshot.ranking ? `#${snapshot.ranking.toLocaleString()}` : "—"}
            />
            <StatCard
              icon={<FlameIcon />}
              label="Current streak"
              value={`${streak} day${streak === 1 ? "" : "s"} 🔥`}
              hint={streak === 0 ? "solve something today to start one" : "consecutive active days"}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <GoalProgress solved={snapshot.solved.All} goal={settings.goal} />
            <DifficultyBreakdown snapshot={snapshot} />
          </div>
          <Streaks calendar={snapshot.calendar} activeDays={snapshot.totalActiveDays} />
          <Heatmap calendar={snapshot.calendar} />
          <DailyActivity calendar={snapshot.calendar} submissions={submissions} />
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <RecentSolves submissions={submissions} />
            <TopicBreakdown tags={snapshot.tags} />
          </div>
        </>
      )}
    </div>
  );
}
