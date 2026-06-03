import { ReactNode } from 'react';

interface StorySectionProps {
  /** Heading shown above the demo. */
  title: string;
  /** Optional one-line caption rendered below the heading. */
  description?: ReactNode;
  /** Cross-axis alignment of the section content. Defaults to 'start'. */
  align?: 'start' | 'center';
  /** Extra classes on the section wrapper (e.g. `flex-1` for equal-width columns). */
  className?: string;
  children: ReactNode;
}

/**
 * Standardized section block for story canvases. Use this instead of
 * hand-rolled `<h3 className="...">` headings so every story shares the same
 * typography — both for single-variant stories (one section) and for
 * comparison views (several sections wrapped in `StoryShowcase`).
 *
 * Children are stacked vertically; pass `align="center"` to center the heading
 * and content (e.g. inside a row showcase column). The title size comes from
 * the theme heading scale; never hardcode `text-lg`/`text-xl` here.
 */
export function StorySection({ title, description, children, align = 'start', className = '' }: StorySectionProps) {
  const alignCssWrapper = align === 'center' ? 'items-center text-center' : '';
  const alignCssContent = align === 'center' ? 'items-center' : 'items-start';

  return (
    <section className={`flex flex-col gap-2 ${alignCssWrapper} ${className}`}>
      <h4 className="font-semibold">{title}</h4>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className={`flex flex-col gap-3 ${alignCssContent}`}>{children}</div>
    </section>
  );
}

/**
 * Lays out multiple `StorySection` blocks with consistent spacing. Use as the
 * root wrapper of a multi-variant showcase story.
 *
 * - `direction="column"` (default): sections stacked vertically.
 * - `direction="row"`: sections side by side — for comparing the same set of
 *   variants across an axis (e.g. one column per size).
 */
export function StoryShowcase({
  children,
  direction = 'column',
}: {
  children: ReactNode;
  direction?: 'row' | 'column';
}) {
  const cssWrapper = direction === 'row' ? 'flex flex-row flex-wrap items-start gap-16' : 'flex flex-col gap-8';
  return <div className={cssWrapper}>{children}</div>;
}

/**
 * Secondary label for sub-groups *inside* a `StorySection` — e.g. the rows or
 * columns of a matrix (a variant axis, a type, a state). Sits one level below
 * the section heading.
 */
export function StoryLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-muted-foreground">{children}</span>;
}
