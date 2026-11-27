import { cn } from '@/components/lib/utils';

import type { DistributionBarItem } from './distribution-bar';
import DistributionSwatch from './distribution-swatch';

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
          <DistributionSwatch color={item.color} index={index} colorblindMode={colorblindMode} />
          <span className="font-semibold">{item.value}</span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default DistributionLegend;
