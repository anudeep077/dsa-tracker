import type { Difficulty, LeetCodeSnapshot } from "@/lib/types";
import { Card } from "./Card";
import { LevelsIcon } from "./icons";

const rows: { key: Difficulty; color: string }[] = [
  { key: "Easy", color: "bg-easy" },
  { key: "Medium", color: "bg-medium" },
  { key: "Hard", color: "bg-hard" },
];

export function DifficultyBreakdown({ snapshot }: { snapshot: LeetCodeSnapshot }) {
  return (
    <Card icon={<LevelsIcon />} title="By difficulty">
      <ul className="space-y-4">
        {rows.map(({ key, color }) => {
          const solved = snapshot.solved[key];
          const total = snapshot.total[key];
          const pct = total ? (solved / total) * 100 : 0;
          return (
            <li key={key}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-medium">{key}</span>
                <span className="tabular-nums text-muted">
                  <span className="text-fg">{solved}</span> / {total}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-track">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
