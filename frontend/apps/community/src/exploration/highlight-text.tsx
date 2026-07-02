import { Fragment } from 'react';

type HighlightTextProps = {
  text: string;
  /** Substring to highlight (case-insensitive). When empty, the text is rendered as-is. */
  query?: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renders `text`, wrapping every case-insensitive occurrence of `query` in a
 * highlight mark. Splits on the (escaped) query so user input can never inject markup.
 */
export default function HighlightText({ text, query }: HighlightTextProps) {
  const trimmed = query?.trim();
  if (!trimmed) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={index} className="rounded-[2px] bg-amber-200 text-amber-950">
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
