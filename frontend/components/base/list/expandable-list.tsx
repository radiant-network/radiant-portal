import React, { useCallback, useState } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

const expandableListVariant = tv({
  slots: {
    base: '',
  },
  variants: {
    size: {
      default: {
        base: '',
      },
      md: {
        base: 'space-y-1',
      },
      lg: {
        base: 'space-y-2',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type ExpandableListProps = VariantProps<typeof expandableListVariant> & {
  visibleCount?: number;
  items: React.ReactElement[];
  onExpand?: () => void;
  className?: string;
  emptyMessage: React.ReactElement;
};

function ExpandableList({ visibleCount = 3, emptyMessage, items, size, onExpand, className }: ExpandableListProps) {
  const { t } = useI18n();
  const [collapse, setCollpase] = useState(true);
  const totalItemsCount = items?.length || 0;
  const sliceNum = collapse ? visibleCount : totalItemsCount;
  const showButton = totalItemsCount > visibleCount;
  const slicedData = items.slice(0, sliceNum);
  const styles = expandableListVariant({ size });

  const handleExpand = useCallback(() => {
    setCollpase(prev => !prev);
    onExpand?.();
  }, [setCollpase]);

  if (emptyMessage && items.length === 0) {
    return emptyMessage;
  }

  return (
    <div className={className}>
      <ul className={styles.base()}>
        {slicedData.map((item, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {showButton && (
        <Button variant="link" size="xs" className="px-0" onClick={handleExpand}>
          {t(`common.actions.${collapse ? 'see_more' : 'see_less'}`, {
            defaultValue: collapse ? 'See more' : 'See less',
          })}
        </Button>
      )}
    </div>
  );
}

export default ExpandableList;
