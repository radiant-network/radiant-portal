import { useCallback, useMemo } from 'react';
import { tv } from 'tailwind-variants';

import { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBActiveQuery, useQBContext, useQBDispatch } from './hooks/use-query-builder';

const queryBar = tv({
  base: 'flex flex-1 py-2 px-3 border ',
  variants: {
    active: {
      true: ['border-primary/75 bg-primary/10'],
      false: ['border-muted-foreground/20 bg-muted/35 text-muted-foreground'],
    },
  },
  defaultVariants: {
    active: false,
  },
});

/**
 * Represent an empty query bar
 */
function QueryBarEmpty() {
  const { t } = useI18n();
  const dispatch = useQBDispatch();
  const activeQuery = useQBActiveQuery();
  const { activeQueryId } = useQBContext();
  const active = useMemo(() => activeQueryId === activeQuery.id, [activeQueryId]);

  /**
   * Active current query
   */
  const handleActive = useCallback(() => {
    if (active) return;

    dispatch({
      type: QBActionType.SET_ACTIVE_QUERY,
      payload: { id: activeQuery.id },
    });
  }, [dispatch, active]);

  return (
    <div className="flex flex-1 group/query" data-query-active={active} onClick={handleActive}>
      <div className="w-1 rounded-s-sm bg-muted-foreground group-data-[query-active=true]/query:bg-primary" />
      <div className={queryBar({ active: activeQueryId === activeQuery.id })}>{t('common.query_bar.empty')}</div>
    </div>
  );
}

export default QueryBarEmpty;
