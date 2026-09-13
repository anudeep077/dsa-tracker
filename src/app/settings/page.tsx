"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Card } from "@/components/Card";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useTracker } from "@/lib/useTracker";
import type { Settings, Theme } from "@/lib/types";

const THEMES: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function SettingsPage() {
  const { settings, hydrated } = useTracker();
  if (!hydrated) return null;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}

// Mounted only after hydration so initial form values come from localStorage.
function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const { settings, updateSettings, syncing, error, sync } = useTracker();
  const [username, setUsername] = useState(initial.username);
  const [goal, setGoal] = useState(String(initial.goal));
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const name = username.trim();
    const goalNum = Math.max(1, Number(goal) || 500);
    const usernameChanged = name !== initial.username;
    updateSettings({ username: name, goal: goalNum });
    setSaved(true);
    if (name && usernameChanged) {
      const ok = await sync(name);
      if (ok) router.push("/");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus:border-fg";

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <Card>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              LeetCode username
            </label>
            <input
              id="username"
              className={inputClass}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSaved(false);
              }}
              placeholder="e.g. lee215"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="mt-1.5 text-xs text-muted">Only your public profile is read — no login or password needed.</p>
          </div>

          <div>
            <label htmlFor="goal" className="text-sm font-medium">
              Problem goal
            </label>
            <input
              id="goal"
              type="number"
              min={1}
              className={inputClass}
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value);
                setSaved(false);
              }}
            />
          </div>

          <div>
            <span className="text-sm font-medium">Appearance</span>
            <div className="relative mt-1.5 inline-grid grid-cols-3 rounded-md border border-line p-0.5">
              {/* Sliding highlight: one segment wide, translated to the active option. */}
              <span
                aria-hidden
                className="absolute top-0.5 bottom-0.5 left-0.5 rounded bg-fg transition-transform duration-200 ease-out"
                style={{
                  width: "calc((100% - 4px) / 3)",
                  transform: `translateX(${THEMES.findIndex((t) => t.value === settings.theme) * 100}%)`,
                }}
              />
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => updateSettings({ theme: t.value })}
                  aria-pressed={settings.theme === t.value}
                  className={`relative rounded px-3 py-1 text-sm transition-colors duration-200 ${
                    settings.theme === t.value ? "text-page" : "text-muted hover:text-fg"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={syncing}
              className="rounded-md bg-fg px-4 py-2 text-sm font-medium text-page hover:opacity-80 disabled:opacity-50"
            >
              {syncing ? "Syncing…" : "Save"}
            </button>
            {saved && !syncing && <span className="text-sm text-muted">Saved</span>}
          </div>
        </form>
      </Card>
    </>
  );
}
