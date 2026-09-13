import { maxStreak } from "@/lib/analytics";
import { CalendarIcon, FlameIcon } from "./icons";
import { StatCard } from "./StatCard";

export function Streaks({ calendar, activeDays }: { calendar: Record<string, number>; activeDays: number }) {
  const max = maxStreak(calendar);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard icon={<CalendarIcon />} label="Active days" value={`${activeDays} 🔥`} hint="past 12 months" />
      <StatCard icon={<FlameIcon />} label="Longest streak" value={`${max} day${max === 1 ? "" : "s"} 🔥`} hint="past 12 months" />
    </div>
  );
}
