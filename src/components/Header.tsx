import type { LeetCodeSnapshot } from "@/lib/types";

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  return new Date(iso).toLocaleString();
}

export function Header({
  snapshot,
  username,
  syncing,
  onSync,
}: {
  snapshot: LeetCodeSnapshot | null;
  username: string;
  syncing: boolean;
  onSync: () => void;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{snapshot?.realName || username}</h1>
        <p className="mt-1 text-sm text-muted">
          <a
            href={`https://leetcode.com/u/${username}/`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg"
          >
            @{username}
          </a>
          {snapshot && <> · last synced {relativeTime(snapshot.fetchedAt)}</>}
        </p>
      </div>
      <button
        onClick={onSync}
        disabled={syncing}
        className="rounded-md bg-fg px-4 py-2 text-sm font-medium text-page hover:opacity-80 disabled:opacity-50"
      >
        {syncing ? "Syncing…" : "Sync now"}
      </button>
    </header>
  );
}
