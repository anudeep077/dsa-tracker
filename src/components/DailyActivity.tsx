"use client";

import { useMemo } from "react";
import { average, bestDay, dailySeries, hourHistogram, peakHour } from "@/lib/analytics";
import type { AcSubmission } from "@/lib/types";
import { Card } from "./Card";
import { MinimalBarChart } from "./charts";
import { BarChartIcon, ClockIcon, StarIcon, TrendIcon } from "./icons";
import { StatCard } from "./StatCard";

const DAYS = 30;

export function DailyActivity({
  calendar,
  submissions,
}: {
  calendar: Record<string, number>;
  submissions: AcSubmission[];
}) {
  const series = useMemo(() => dailySeries(calendar, DAYS), [calendar]);
  const avg = average(series);
  const best = useMemo(() => bestDay(calendar), [calendar]);
  const hours = useMemo(() => hourHistogram(submissions), [submissions]);
  const peak = peakHour(hours);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<TrendIcon />} label="Daily average" value={avg.toFixed(1)} hint={`submissions/day, last ${DAYS} days`} />
        <StatCard
          icon={<StarIcon />}
          label="Best day"
          value={best ? best.count : "—"}
          hint={best ? `submissions on ${best.label}` : "no activity yet"}
        />
        <StatCard
          icon={<ClockIcon />}
          label="Peak hour"
          value={peak ? peak.label : "—"}
          hint={peak ? `${peak.count} of ${submissions.length} solves` : "syncs build this up over time"}
        />
      </div>

      <Card icon={<BarChartIcon />} title={`Submissions per day · last ${DAYS} days`}>
        <MinimalBarChart data={series} unit="submissions" tickInterval={6} />
      </Card>
    </>
  );
}
