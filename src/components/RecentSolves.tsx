"use client";

import { useMemo, useState } from "react";
import type { AcSubmission } from "@/lib/types";
import { Card } from "./Card";
import { FindSolutionButton } from "./FindSolutionButton";
import { ListCheckIcon } from "./icons";

const INITIAL = 10;

function when(ts: number) {
  return new Date(ts * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function RecentSolves({ submissions }: { submissions: AcSubmission[] }) {
  const [expanded, setExpanded] = useState(false);

  // One row per problem — keep only the most recent accepted submission of each.
  const problems = useMemo(() => {
    const seen = new Set<string>();
    return submissions.filter((s) => !seen.has(s.titleSlug) && seen.add(s.titleSlug));
  }, [submissions]);

  if (problems.length === 0) return null;
  const visible = expanded ? problems : problems.slice(0, INITIAL);

  return (
    <Card icon={<ListCheckIcon />} title="Recent solves">
      <ul className="divide-y divide-line">
        {visible.map((p) => (
          <li key={p.titleSlug} className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <div className="min-w-0">
              <a
                href={`https://leetcode.com/problems/${p.titleSlug}/`}
                target="_blank"
                rel="noreferrer"
                className="block truncate hover:underline"
              >
                {p.title}
              </a>
              <span className="text-xs text-muted">{when(p.timestamp)}</span>
            </div>
            <FindSolutionButton title={p.title} />
          </li>
        ))}
      </ul>
      {problems.length > INITIAL && (
        <button onClick={() => setExpanded((e) => !e)} className="mt-4 text-sm text-muted hover:text-fg">
          {expanded ? "Show less" : `Show all ${problems.length}`}
        </button>
      )}
    </Card>
  );
}
