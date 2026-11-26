import { cn } from '@/components/lib/utils';

import { distributionBarColorClasses, type DistributionBarItem, getDistributionPatternStyle } from './distribution-bar';

type DistributionLegendProps = {
  items: DistributionBarItem[];
  colorblindMode?: boolean;
  className?: string;
};

function DistributionLegend({ items, colorblindMode = false, className }: DistributionLegendProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-2 text-sm', className)}>
      {items.map((item, index) => (
        <li key={item.key} className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              'h-3 shrink-0 rounded-sm',
              colorblindMode ? 'w-6' : 'w-3',
              distributionBarColorClasses[item.color],
            )}
            style={colorblindMode ? getDistributionPatternStyle(index) : undefined}
          />
          <span className="font-semibold">{item.value}</span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default DistributionLegend;
