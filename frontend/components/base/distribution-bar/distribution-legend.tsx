import { cn } from '@/components/lib/utils';

import { distributionBarColorClasses, type DistributionBarItem } from './distribution-bar';

type DistributionLegendProps = {
  items: DistributionBarItem[];
  className?: string;
};

function DistributionLegend({ items, className }: DistributionLegendProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-2 text-sm', className)}>
      {items.map(item => (
        <li key={item.key} className="flex items-center gap-2">
          <span aria-hidden className={cn('size-3 shrink-0 rounded-sm', distributionBarColorClasses[item.color])} />
          <span className="font-semibold">{item.value}</span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default DistributionLegend;
