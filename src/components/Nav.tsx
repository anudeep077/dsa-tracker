"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
] as const;

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-line bg-card">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
          <Logo />
          DSA Tracker
        </Link>
        <div className="flex gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "text-fg" : "text-muted hover:text-fg"}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
