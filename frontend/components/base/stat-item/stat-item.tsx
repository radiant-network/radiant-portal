import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils';

type StatItemProps = ComponentProps<'div'> & {
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  iconClassName?: string;
  labelClassName?: string;
};

/**
 * Compact statistic: optional leading icon + a large value and a muted label.
 * Used for the "Data Release" figures on the landing page.
 */
function StatItem({ icon, value, label, className, iconClassName, labelClassName, ...props }: StatItemProps) {
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      {icon && <div className={cn('text-primary shrink-0 [&_svg]:size-8', iconClassName)}>{icon}</div>}
      <div className="flex flex-col">
        <span className="text-2xl font-semibold leading-tight">{value}</span>
        <span className={cn('text-muted-foreground text-sm', labelClassName)}>{label}</span>
      </div>
    </div>
  );
}

export default StatItem;
