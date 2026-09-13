"use client";

import { useState } from "react";
import type { TagCount } from "@/lib/types";
import { Card } from "./Card";
import { TagIcon } from "./icons";

const INITIAL = 10;

export function TopicBreakdown({ tags }: { tags: TagCount[] }) {
  const [expanded, setExpanded] = useState(false);
  if (tags.length === 0) return null;

  const max = tags[0].problemsSolved;
  const visible = expanded ? tags : tags.slice(0, INITIAL);

  return (
    <Card icon={<TagIcon />} title="By topic">
      <ul className="space-y-2.5">
        {visible.map((tag) => (
          <li key={tag.tagSlug} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-3 text-sm">
            <span className="truncate">{tag.tagName}</span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-track">
              <div className="h-full rounded-full bg-accent" style={{ width: `${(tag.problemsSolved / max) * 100}%` }} />
            </div>
            <span className="text-right tabular-nums text-muted">{tag.problemsSolved}</span>
          </li>
        ))}
      </ul>
      {tags.length > INITIAL && (
        <button onClick={() => setExpanded((e) => !e)} className="mt-4 text-sm text-muted hover:text-fg">
          {expanded ? "Show less" : `Show all ${tags.length} topics`}
        </button>
      )}
    </Card>
  );
}
