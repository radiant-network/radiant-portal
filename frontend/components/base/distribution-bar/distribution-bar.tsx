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
  green: 'bg-green',
  lime: 'bg-lime',
  yellow: 'bg-yellow',
  amber: 'bg-amber',
  orange: 'bg-orange',
  red: 'bg-red',
  cyan: 'bg-cyan',
  blue: 'bg-blue',
  violet: 'bg-violet',
  fuchsia: 'bg-fuchsia',
  neutral: 'bg-neutral',
};

type DistributionBarProps = {
  items: DistributionBarItem[];
  className?: string;
};

function DistributionBar({ items, className }: DistributionBarProps) {
  const visibleItems = items.filter(item => item.value > 0);
  const ariaLabel = items.map(item => `${item.value} ${item.label}`).join(', ');

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'flex h-3.5 w-full gap-0.5 overflow-hidden rounded-sm',
        visibleItems.length === 0 && 'bg-muted',
        className,
      )}
    >
      {visibleItems.map(item => (
        <div
          key={item.key}
          className={cn('h-full basis-0', distributionBarColorClasses[item.color])}
          style={{ flexGrow: item.value }}
        />
      ))}
    </div>
  );
}

export default DistributionBar;
