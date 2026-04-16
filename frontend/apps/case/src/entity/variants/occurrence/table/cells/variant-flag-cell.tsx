import { Flag, Pin, Star } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';

import { type FlagType, useVariantFlag } from '../../hooks/use-variant-flags';

const FLAG_CONFIG = {
  flag: {
    icon: Flag,
    triggerClass: 'text-indicator-red fill-indicator-red',
    menuClass: 'text-indicator-red fill-indicator-red',
    label: 'Flag',
  },
  pin: {
    icon: Pin,
    triggerClass: 'text-indicator-amber fill-indicator-amber',
    menuClass: 'text-indicator-amber fill-indicator-amber',
    label: 'Pin',
  },
  star: {
    icon: Star,
    triggerClass: 'text-indicator-blue fill-indicator-blue',
    menuClass: 'text-indicator-blue fill-indicator-blue',
    label: 'Star',
  },
} as const satisfies Record<FlagType, { icon: typeof Flag; triggerClass: string; menuClass: string; label: string }>;

const FLAG_TYPES = Object.entries(FLAG_CONFIG) as [FlagType, (typeof FLAG_CONFIG)[FlagType]][];

type VariantFlagCellProps = {
  locusId: string;
  variant?: 'ghost' | 'outline';
  size?: '2xs' | 'sm';
};

function VariantFlagCell({ locusId, variant = 'ghost', size = '2xs' }: VariantFlagCellProps) {
  const [currentFlag, setFlag] = useVariantFlag(locusId);

  const config = currentFlag ? FLAG_CONFIG[currentFlag] : null;
  const TriggerIcon = config?.icon ?? Flag;
  const inactiveClass = variant === 'ghost' ? 'text-muted-foreground/40' : '';
  const triggerClass = config?.triggerClass ?? inactiveClass;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button iconOnly variant={variant} size={size}>
          <TriggerIcon className={triggerClass} size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {FLAG_TYPES.map(([type, cfg]) => {
          const Icon = cfg.icon;
          return (
            <DropdownMenuCheckboxItem
              key={type}
              checked={currentFlag === type}
              onSelect={() => setFlag(currentFlag === type ? null : type)}
            >
              <span className="flex items-center gap-2">
                <Icon className={cfg.menuClass} size={14} />
                <span>{cfg.label}</span>
              </span>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default VariantFlagCell;
