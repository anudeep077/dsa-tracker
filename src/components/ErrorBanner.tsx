export function ErrorBanner({ message, onRetry, retrying }: { message: string; onRetry?: () => void; retrying?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} disabled={retrying} className="shrink-0 font-medium underline disabled:opacity-50">
          {retrying ? "Retrying…" : "Retry"}
        </button>
      )}
    </div>
  );
}
