import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  icon,
  children,
  className = "",
}: {
  title?: string;
  /** Optional one-line explainer shown under the title, for less obvious sections. */
  subtitle?: string;
  /** Small line icon rendered before the title. */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-line bg-card p-5 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
