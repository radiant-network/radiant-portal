/** Animated "assistant is thinking" dots — a generic in-flight indicator. */
export function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" role="status" aria-label="Assistant is thinking">
      {[0, 150, 300].map(delay => (
        <span
          key={delay}
          className="size-1.5 animate-bounce rounded-full bg-current"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
