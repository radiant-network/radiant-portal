import type { CSSProperties } from 'react';

import { cn } from '@/components/lib/utils';

export type DistributionBarColor =
  | 'green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'red'
  | 'cyan'
  | 'blue'
  | 'violet'
  | 'fuchsia'
  | 'neutral';

export type DistributionBarItem = {
  key: string;
  label: string;
  value: number;
  color: DistributionBarColor;
};

export const distributionBarColorClasses: Record<DistributionBarColor, string> = {
  green: 'bg-green text-green',
  lime: 'bg-lime text-lime',
  yellow: 'bg-yellow text-yellow',
  amber: 'bg-amber text-amber',
  orange: 'bg-orange text-orange',
  red: 'bg-red text-red',
  cyan: 'bg-cyan text-cyan',
  blue: 'bg-blue text-blue',
  violet: 'bg-violet text-violet',
  fuchsia: 'bg-fuchsia text-fuchsia',
  neutral: 'bg-neutral text-neutral',
};

const PATTERN_COUNT = 3;
// currentColor: the theme colors are inlined, so no --color-<name> variable exists at runtime.
const PATTERN_ACCENT = 'color-mix(in oklab, currentColor 85%, black)';

/**
 * Pattern drawn over the item color for colorblind users, picked by the item position like the charts.
 */
export function getDistributionPatternStyle(index: number): CSSProperties {
  const accent = PATTERN_ACCENT;
  switch (index % PATTERN_COUNT) {
    case 0:
      return { backgroundImage: `repeating-linear-gradient(45deg, ${accent} 0 1.5px, transparent 1.5px 6px)` };
    case 1:
      return { backgroundImage: `radial-gradient(${accent} 1px, transparent 1.5px)`, backgroundSize: '5px 5px' };
    default:
      return { backgroundImage: `repeating-linear-gradient(-45deg, ${accent} 0 1.5px, transparent 1.5px 6px)` };
  }
}

type DistributionBarProps = {
  items: DistributionBarItem[];
  colorblindMode?: boolean;
  className?: string;
};

function DistributionBar({ items, colorblindMode = false, className }: DistributionBarProps) {
  const isEmpty = items.every(item => item.value <= 0);
  const ariaLabel = items.map(item => `${item.value} ${item.label}`).join(', ');

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('flex h-3.5 w-full gap-0.5 overflow-hidden rounded-sm', isEmpty && 'bg-muted', className)}
    >
      {items.map((item, index) =>
        item.value > 0 ? (
          <div
            key={item.key}
            className={cn('h-full basis-0', distributionBarColorClasses[item.color])}
            style={{
              flexGrow: item.value,
              ...(colorblindMode ? getDistributionPatternStyle(index) : {}),
            }}
          />
        ) : null,
      )}
    </div>
  );
}

export default DistributionBar;
