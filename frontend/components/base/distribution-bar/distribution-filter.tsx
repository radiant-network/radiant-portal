import { Toggle } from '@/components/base/shadcn/toggle';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import type { DistributionBarItem } from './distribution-bar';
import DistributionSwatch from './distribution-swatch';

type DistributionFilterProps = {
  items: DistributionBarItem[];
  /** Keys of the selected items; empty means all */
  value: string[];
  onValueChange: (value: string[]) => void;
  allLabel: string;
  colorblindMode?: boolean;
  className?: string;
};

const TOGGLE_CLASS_NAME = 'px-2.5 font-normal';

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
      {/* All cannot be unselected: it only clears the selection */}
      <Toggle
        variant="outline"
        size="xs"
        className={TOGGLE_CLASS_NAME}
        pressed={value.length === 0}
        onPressedChange={() => onValueChange([])}
      >
        <span className="font-semibold">{total}</span>
        <span>{allLabel}</span>
      </Toggle>
      {items.map((item, index) => (
        <Toggle
          key={item.key}
          variant="outline"
          size="xs"
          className={TOGGLE_CLASS_NAME}
          pressed={value.includes(item.key)}
          onPressedChange={() => handleToggle(item.key)}
        >
          <DistributionSwatch color={item.color} index={index} colorblindMode={colorblindMode} />
          <span className="font-semibold">{item.value}</span>
          <span>{item.label}</span>
        </Toggle>
      ))}
    </div>
  );
}

export default DistributionFilter;
