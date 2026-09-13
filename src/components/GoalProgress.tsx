import Link from "next/link";
import { Card } from "./Card";
import { TargetIcon } from "./icons";

export function GoalProgress({ solved, goal }: { solved: number; goal: number }) {
  const pct = Math.min(100, (solved / goal) * 100);
  const remaining = Math.max(0, goal - solved);
  return (
    <Card icon={<TargetIcon />} title="Goal">
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-semibold tabular-nums tracking-tight">
          {solved}
          <span className="text-base font-normal text-muted"> / {goal}</span>
        </p>
        <p className="text-sm tabular-nums text-muted">{pct.toFixed(0)}%</p>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-track">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">
        {remaining === 0 ? "Goal reached." : `${remaining} to go.`}{" "}
        <Link href="/settings" className="hover:text-fg">
          Edit goal
        </Link>
      </p>
    </Card>
  );
}
