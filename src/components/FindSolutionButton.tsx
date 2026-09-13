/** Deep link to a YouTube search for an explanation of the problem. */
export function FindSolutionButton({ title }: { title: string }) {
  const query = encodeURIComponent(`leetcode ${title} solution explained`);
  return (
    <a
      href={`https://youtube.com/results?search_query=${query}`}
      target="_blank"
      rel="noreferrer"
      title="Search YouTube for a solution"
      aria-label={`Find solution for ${title} on YouTube`}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-muted hover:border-fg hover:text-fg"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      Find solution
    </a>
  );
}
