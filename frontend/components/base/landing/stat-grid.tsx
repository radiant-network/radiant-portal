import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import StatItem, { type StatItemSize } from '../stat-item/stat-item';

export type StatGridItem = {
  key: string;
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
};

type StatGridProps = {
  items: StatGridItem[];
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  size?: StatItemSize;
};

/** Responsive grid of StatItem figures. Pass column classes via `className`. */
function StatGrid({ items, className, iconClassName, labelClassName, size }: StatGridProps) {
  return (
    <div className={cn('grid gap-6', className)}>
      {items.map(item => (
        <StatItem
          key={item.key}
          className="min-w-0"
          icon={item.icon}
          value={item.value}
          label={item.label}
          size={size}
          iconClassName={iconClassName}
          labelClassName={labelClassName}
        />
      ))}
    </div>
  );
}

export default StatGrid;
