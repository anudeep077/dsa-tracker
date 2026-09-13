"use client";

import type { TooltipContentProps } from "recharts";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Shared minimal bar chart used by the daily and hourly views. Axis/label
// colors come from the theme tokens so it reads correctly in dark mode.
const AXIS = { fontSize: 11, fill: "var(--muted)" };

function MinimalTooltip({ active, payload, label, unit }: TooltipContentProps<number, string> & { unit: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  return (
    <div className="rounded-md border border-line bg-card px-2.5 py-1.5 text-xs shadow-sm">
      <span className="text-muted">{label}</span>
      <span className="ml-2 font-medium tabular-nums">
        {value} {unit}
      </span>
    </div>
  );
}

export function MinimalBarChart<T extends { label: string; count: number }>({
  data,
  unit,
  tickInterval,
}: {
  data: T[];
  unit: string;
  tickInterval: number;
}) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -24 }} barCategoryGap="25%">
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: "var(--line)" }} interval={tickInterval} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} width={48} />
          <Tooltip
            cursor={{ fill: "var(--track)" }}
            content={(props) => <MinimalTooltip {...(props as TooltipContentProps<number, string>)} unit={unit} />}
          />
          <Bar dataKey="count" fill="var(--color-accent)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
