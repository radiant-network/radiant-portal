import type { ReactNode } from 'react';

import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import type { DistributionBarItem } from './distribution-bar';
import DistributionSwatch from './distribution-swatch';

type DistributionFilterProps = {
  items: DistributionBarItem[];
  /** Keys of the selected items; empty means all */
  value: string[];
  onValueChange: (value: string[]) => void;
  /** Already translated label of the "all" button */
  allLabel: string;
  colorblindMode?: boolean;
  className?: string;
};

type FilterButtonProps = {
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
};

function FilterButton({ isSelected, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        'flex h-8 items-center gap-2 rounded-full border bg-background px-3 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        isSelected && 'border-foreground ring-1 ring-foreground',
      )}
    >
      {children}
    </button>
  );
}

function DistributionFilter({
  items,
  value,
  onValueChange,
  allLabel,
  colorblindMode = false,
  className,
}: DistributionFilterProps) {
  const { t } = useI18n();
  const total = items.reduce((sum, item) => sum + item.value, 0);

  function handleToggle(key: string) {
    const next = value.includes(key) ? value.filter(selected => selected !== key) : [...value, key];
    // every item selected is the same as all
    onValueChange(next.length === items.length ? [] : next);
  }

  return (
    <div
      role="group"
      aria-label={t('a11y.distribution_filter.label')}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <FilterButton isSelected={value.length === 0} onClick={() => onValueChange([])}>
        <span className="font-semibold">{total}</span>
        <span>{allLabel}</span>
      </FilterButton>
      {items.map((item, index) => (
        <FilterButton key={item.key} isSelected={value.includes(item.key)} onClick={() => handleToggle(item.key)}>
          <DistributionSwatch color={item.color} index={index} colorblindMode={colorblindMode} />
          <span className="font-semibold">{item.value}</span>
          <span>{item.label}</span>
        </FilterButton>
      ))}
    </div>
  );
}

export default DistributionFilter;
