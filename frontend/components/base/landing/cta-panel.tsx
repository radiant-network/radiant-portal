import type { ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '../../lib/utils';

const ctaPanelVariants = tv({
  slots: {
    title: 'font-semibold tracking-tight',
    description: 'text-muted-foreground',
  },
  variants: {
    size: {
      md: { title: 'text-xl', description: 'text-base' },
      lg: { title: 'text-5xl', description: 'text-xl font-normal' },
    },
  },
  defaultVariants: { size: 'md' },
});

export type CtaPanelSize = VariantProps<typeof ctaPanelVariants>['size'];

type CtaPanelProps = VariantProps<typeof ctaPanelVariants> & {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  footer?: ReactNode;
  className?: string;
  descriptionClassName?: string;
  /** Center the content on small screens, left-aligned from `md` up. */
  centerOnMobile?: boolean;
};

/** Call-to-action panel: optional icon + title, description and action buttons. */
function CtaPanel({
  icon,
  title,
  description,
  footer,
  className,
  descriptionClassName,
  size,
  centerOnMobile = false,
}: CtaPanelProps) {
  const styles = ctaPanelVariants({ size });

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centerOnMobile && 'items-center text-center md:items-start md:text-left',
        className,
      )}
    >
      <div className={cn('flex items-center gap-4', centerOnMobile && 'justify-center md:justify-start')}>
        {icon && (
          <span className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-full [&_svg]:size-7">
            {icon}
          </span>
        )}
        <h3 className={styles.title()}>{title}</h3>
      </div>
      <p className={styles.description({ className: descriptionClassName })}>{description}</p>
      {footer && (
        <div className={cn('flex flex-wrap gap-3', centerOnMobile && 'justify-center md:justify-start')}>{footer}</div>
      )}
    </div>
  );
}

export default CtaPanel;
