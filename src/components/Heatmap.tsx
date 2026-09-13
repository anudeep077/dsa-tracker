"use client";

import { useMemo } from "react";
import { dayLabel, heatmap } from "@/lib/analytics";
import { Card } from "./Card";
import { GridIcon } from "./icons";

// Accent at increasing opacity; level 0 uses the neutral track color.
const LEVELS = ["var(--track)", "rgb(37 99 235 / 0.3)", "rgb(37 99 235 / 0.5)", "rgb(37 99 235 / 0.75)", "rgb(37 99 235 / 1)"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MIN_CELL = 10;
const LABEL_COL = 32;

export function Heatmap({ calendar }: { calendar: Record<string, number> }) {
  const weeks = useMemo(() => heatmap(calendar), [calendar]);
  const total = useMemo(() => Object.values(calendar).reduce((a, b) => a + b, 0), [calendar]);

  return (
    <Card icon={<GridIcon />} title="Activity" subtitle="Each square is a day — darker means more submissions.">
      <div className="overflow-x-auto">
        {/* One CSS grid: label column + one column per week; cells scale with the card width. */}
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `${LABEL_COL}px repeat(${weeks.length}, minmax(${MIN_CELL}px, 1fr))`,
            minWidth: LABEL_COL + weeks.length * (MIN_CELL + 3),
          }}
        >
          {/* Month labels */}
          <span />
          {weeks.map((w, i) => (
            <span key={i} className="overflow-visible whitespace-nowrap text-[10px] leading-4 text-muted">
              {w.month}
            </span>
          ))}

          {/* Seven day rows */}
          {DAY_LABELS.map((label, d) => (
            <Row key={d} label={label} day={d} weeks={weeks} />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>{total} submissions in the past 12 months</span>
        <span className="flex items-center gap-1">
          Less
          {LEVELS.map((bg, i) => (
            <span key={i} className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: bg }} />
          ))}
          More
        </span>
      </div>
    </Card>
  );
}

function Row({ label, day, weeks }: { label: string; day: number; weeks: ReturnType<typeof heatmap> }) {
  return (
    <>
      <span className="self-center text-[10px] leading-none text-muted">{label}</span>
      {weeks.map((week, wi) => {
        const cell = week.days[day];
        return cell ? (
          <div
            key={wi}
            className="aspect-square rounded-[2px]"
            style={{ background: LEVELS[cell.level] }}
            title={`${cell.count} submission${cell.count === 1 ? "" : "s"} on ${dayLabel(cell.ts, true)}`}
          />
        ) : (
          <div key={wi} className="aspect-square" />
        );
      })}
    </>
  );
}
