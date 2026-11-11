import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
  titleClassName?: string;
};

/** Centered (default) uppercase section title with optional subtitle. Used across landing sections. */
function SectionHeading({ title, subtitle, align = 'center', className, titleClassName }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      <h1 className={cn('text-primary text-5xl font-bold uppercase tracking-tight', titleClassName)}>{title}</h1>
      {subtitle && (
        <p className={cn('text-primary mt-3 text-xl font-semibold', align === 'center' && 'mx-auto')}>{subtitle}</p>
      )}
    </div>
  );
}

export default SectionHeading;
