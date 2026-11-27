import { cn } from '@/components/lib/utils';

import {
  type DistributionBarColor,
  distributionBarColorClasses,
  getDistributionPatternStyle,
} from './distribution-bar';

type DistributionSwatchProps = {
  color: DistributionBarColor;
  /** Position of the item in the bar, which picks its pattern */
  index: number;
  colorblindMode?: boolean;
};

function DistributionSwatch({ color, index, colorblindMode = false }: DistributionSwatchProps) {
  return (
    <span
      aria-hidden
      className={cn('h-3 shrink-0 rounded-xl', colorblindMode ? 'w-6' : 'w-3', distributionBarColorClasses[color])}
      style={colorblindMode ? getDistributionPatternStyle(index) : undefined}
    />
  );
}

export default DistributionSwatch;
