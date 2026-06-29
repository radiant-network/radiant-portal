import type { ComponentProps, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '../../lib/utils';

export enum StatItemLayout {
  Stacked = 'stacked',
  Inline = 'inline',
}

const statItemVariants = tv({
  slots: {
    icon: 'text-primary shrink-0',
    value: 'font-semibold leading-tight',
    label: 'text-muted-foreground',
  },
  variants: {
    size: {
      md: { icon: '[&_svg]:size-8', value: 'text-2xl', label: 'text-sm' },
      lg: { icon: '[&_svg]:size-10', value: 'text-4xl', label: 'text-base' },
    },
  },
  defaultVariants: { size: 'md' },
});

export type StatItemSize = VariantProps<typeof statItemVariants>['size'];

type StatItemProps = ComponentProps<'div'> &
  VariantProps<typeof statItemVariants> & {
    icon?: ReactNode;
    value: ReactNode;
    label: ReactNode;
    iconClassName?: string;
    labelClassName?: string;
    layout?: StatItemLayout;
  };

/**
 * Compact statistic: optional leading icon + a value and a muted label.
 */
function StatItem({
  icon,
  value,
  label,
  className,
  iconClassName,
  labelClassName,
  layout = StatItemLayout.Stacked,
  size,
  ...props
}: StatItemProps) {
  const styles = statItemVariants({ size });

  if (layout === StatItemLayout.Inline) {
    return (
      <div className={cn('flex items-center gap-2', className)} {...props}>
        {icon && <span className={styles.icon({ className: iconClassName })}>{icon}</span>}
        <span className={styles.value({ className: 'text-primary' })}>
          {value}
          <span className={cn('ml-2', labelClassName)}>{label}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      {icon && <div className={styles.icon({ className: iconClassName })}>{icon}</div>}
      <div className="flex flex-col">
        <span className={styles.value()}>{value}</span>
        <span className={styles.label({ className: labelClassName })}>{label}</span>
      </div>
    </div>
  );
}

export default StatItem;
