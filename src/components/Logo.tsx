/** App mark: rounded tile with three ascending bars (progress going up). */
export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="currentColor" />
      <path
        d="M6.5 18v-5M12 18V9.5M17.5 18V5"
        stroke="var(--page)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
