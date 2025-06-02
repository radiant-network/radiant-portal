import React, { Fragment, useCallback, useState } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import { Button } from '@/components/base/ui/button';

export interface ExpandableListProps<T> {
  /**
   * Default: 3
   */
  visibleCount?: number;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onExpand?: () => void;
}

function ExpandableList<T>({ visibleCount = 3, items, renderItem, onExpand }: ExpandableListProps<T>) {
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
    <Fragment>
      <ul>
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
    </Fragment>
  );
}

export default ExpandableList;
