// Small hand-drawn line icons (24px grid, stroke = currentColor). Kept inline
// rather than pulling in an icon library — there are only a handful.
type IconProps = { className?: string };

const base = "h-4 w-4";
const stroke = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" {...stroke} />
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" {...stroke} />
      <path d="M8 6H5v1.5A3.5 3.5 0 0 0 8.5 11M16 6h3v1.5a3.5 3.5 0 0 1-3.5 5" {...stroke} />
      <path d="M12 13v4M9 20h6M10 17h4v3h-4z" {...stroke} />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
        {...stroke}
      />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" {...stroke} />
      <path d="M4 9.5h16M8 3v3M16 3v3" {...stroke} />
    </svg>
  );
}

export function TrendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="M4 17l5-5 4 4 7-8" {...stroke} />
      <path d="M15 8h5v5" {...stroke} />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5Z" {...stroke} />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 7v5l3 2" {...stroke} />
    </svg>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...stroke} />
      <circle cx="12" cy="12" r="5" {...stroke} />
      <circle cx="12" cy="12" r="1" {...stroke} />
    </svg>
  );
}

export function LevelsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="M5 19v-4M12 19V9M19 19V4" {...stroke} />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" {...stroke} />
      <rect x="14" y="4" width="6" height="6" rx="1" {...stroke} />
      <rect x="4" y="14" width="6" height="6" rx="1" {...stroke} />
      <rect x="14" y="14" width="6" height="6" rx="1" {...stroke} />
    </svg>
  );
}

export function BarChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="M4 20h16" {...stroke} />
      <rect x="6" y="11" width="3" height="6" rx="0.5" {...stroke} />
      <rect x="11" y="6" width="3" height="11" rx="0.5" {...stroke} />
      <rect x="16" y="13" width="3" height="4" rx="0.5" {...stroke} />
    </svg>
  );
}

export function ListCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="m4 7 1.5 1.5L8 6M4 13l1.5 1.5L8 12M4 19l1.5 1.5L8 18" {...stroke} />
      <path d="M11 7h9M11 13h9M11 19h9" {...stroke} />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden="true">
      <path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8-8-8Z" {...stroke} />
      <circle cx="8.5" cy="8.5" r="1" {...stroke} />
    </svg>
  );
}
