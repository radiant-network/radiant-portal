import React, { useCallback, useState } from 'react';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

export interface ExpandableListProps<T> {
  /**
   * Default: 3
   */
  visibleCount?: number;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onExpand?: () => void;
  className?: string;
}

function ExpandableList<T>({ visibleCount = 3, items, renderItem, onExpand, className }: ExpandableListProps<T>) {
  const { t } = useI18n();
  const [collapse, setCollpase] = useState(true);
  const totalItemsCount = items?.length || 0;
  const sliceNum = collapse ? visibleCount : totalItemsCount;
  const showButton = totalItemsCount > visibleCount;
  const slicedData = items.slice(0, sliceNum);

  const handleExpand = useCallback(() => {
    setCollpase(prev => !prev);
    onExpand?.();
  }, [setCollpase]);

  return (
    <div>
      <ul className={className}>
        {slicedData.map((item, index: number) => (
          <li key={index}>{renderItem(item, index)}</li>
        ))}
      </ul>
      {showButton && (
        <Button variant="link" size="xs" className="px-0" onClick={handleExpand}>
          {t(`common.${collapse ? 'seeMore' : 'seeLess'}`, {
            defaultValue: collapse ? 'See more' : 'See less',
          })}
        </Button>
      )}
    </div>
  );
}

export default ExpandableList;
