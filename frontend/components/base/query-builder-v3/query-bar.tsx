import { useCallback, useMemo } from 'react';
import { CopyIcon, TrashIcon } from 'lucide-react';
import useSWR from 'swr';
import { tv } from 'tailwind-variants';

import { Count, SqonContent, SqonOpEnum } from '@/api/api';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Button } from '@/components/base/shadcn/button';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Spinner } from '@/components/base/shadcn/spinner';
import { isEmptySqon } from '@/components/cores/query-builder';
import { useI18n } from '@/components/hooks/i18n';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';
import { cn } from '@/components/lib/utils';

import { QBActionType, useQBContext, useQBDispatch, useQBSettings, useQBSqonsCount } from './hooks/use-query-builder';
import { isBoolean, isCombinedQuery, isRange } from './libs/sqon';
import { getColorByIndex } from './libs/theme';
import BooleanQueryPill from './pills/boolean-query-pill';
import CombinedQueryPill from './pills/combined-query-pill';
import MultiSelectQueryPill from './pills/multiselect-query-pill';
import NumericalQueryPill from './pills/numerical-query-pill';
import CombinerOperator from './pills/operators/combiner-operator';
import { ISqonGroupFacet, ISyntheticSqon, IValueFacet, TSyntheticSqonContentValue } from './type';

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
 * Type
 */
type QueryBarProps = {
  index: number;
  sqon: ISyntheticSqon;
};

/**
 * Simple factory design pattern to create the correct query-pill
 */
function factory(content: TSyntheticSqonContentValue) {
  if (isCombinedQuery(content as ISqonGroupFacet)) {
    return <CombinedQueryPill sqon={content as ISyntheticSqon} />;
  }

  if (isRange(content as IValueFacet)) {
    return <NumericalQueryPill sqon={content as IValueFacet} />;
  }

  if (isBoolean(content as IValueFacet)) {
    return <BooleanQueryPill sqon={content as IValueFacet} />;
  }

  return <MultiSelectQueryPill sqon={content as IValueFacet} />;
}

/**
 * Represent a single query.
 * A query is a combinaison of multiple sqon (multi-select, numerical, boolean etc.)
 *
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 */
function QueryBar({ index, sqon }: QueryBarProps) {
  const { t } = useI18n();
  const dispatch = useQBDispatch();
  const sqonsCount = useQBSqonsCount();
  const { activeQueryId } = useQBContext();
  const { combinedQueries } = useQBSettings();
  const { fetcher } = useQBContext();
  const { selectedQueries } = useQBSettings();
  const active = useMemo(() => activeQueryId === sqon.id, [activeQueryId]);
  const backgroundColor = useMemo(
    () => ({
      'border-primary/75 bg-primary/10': active,
      'border-muted-foreground/20 bg-muted/35 text-muted-foreground': !active,
    }),
    [active],
  );
  const identifierStyle = useMemo(() => {
    // is referenced by an active combined query
    if (
      !active &&
      combinedQueries[activeQueryId] !== undefined &&
      Object.keys(combinedQueries).includes(activeQueryId) &&
      combinedQueries[activeQueryId].includes(sqon.id)
    ) {
      return { backgroundColor: getColorByIndex(index) };
    }
    return {};
  }, [activeQueryId, active, combinedQueries]);

  /**
   * Fetcher
   */
  const fetchTotal = useSWR<Count>(
    `${JSON.stringify(sqon)}-count`,
    () =>
      fetcher.count({
        countBody: {
          sqon: {
            content: sqon.content as SqonContent,
            op: sqon.op as SqonOpEnum,
          },
        },
      }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      shouldRetryOnError: false,
    },
  );

  /**
   * Active current query
   */
  const handleActive = useCallback(() => {
    if (active) return;

    dispatch({
      type: QBActionType.SET_ACTIVE_QUERY,
      payload: { id: sqon.id },
    });
  }, [dispatch, active]);

  /**
   * Active selection of the query
   */
  const handleSelection = useCallback(
    (checked: boolean) => {
      dispatch({
        type: QBActionType.SELECT_QUERY,
        payload: {
          uuid: sqon.id,
          isSelected: checked,
        },
      });
    },
    [dispatch, sqon],
  );

  /**
   * Use to duplicate a query
   */
  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: QBActionType.DUPLICATE_QUERY,
        payload: sqon,
      });
    },
    [dispatch, sqon],
  );

  /**
   * Delete current query
   */
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: QBActionType.REMOVE_QUERY,
        payload: sqon,
      });
    },
    [dispatch, sqon],
  );

  return (
    <div className="flex flex-1 group/query" data-query-active={active} onClick={handleActive}>
      {/* Identifier: color for combined query quick identification */}
      <div
        className={cn('w-1 rounded-s-sm bg-muted-foreground', {
          'bg-primary': active,
        })}
        style={identifierStyle}
      />

      {/* Empty query */}
      {isEmptySqon(sqon) && <div className={queryBar({ active })}>{t('common.query_bar.empty')}</div>}

      {/* Query with pills */}
      {!isEmptySqon(sqon) && (
        <>
          {/* selector */}
          <div
            className={cn('flex gap-2 items-center py-4 px-4 border-l border-t border-b', backgroundColor, {
              hidden: sqonsCount <= 1,
            })}
          >
            <Checkbox
              size="sm"
              defaultChecked={false}
              checked={selectedQueries.includes(sqon.id)}
              onCheckedChange={handleSelection}
            />
            <span className="text-xs font-medium">{t('common.query_bar.selector', { index: index + 1 })}</span>
          </div>

          {/* query */}
          <div className={cn('flex flex-1 justify-between py-3 px-3 border', backgroundColor)}>
            <div className="flex flex-1 flex-wrap max-h-[30vh]">
              {sqon.content.map((content, index) => (
                <div key={index} className="flex mt-1">
                  {factory(content)}
                  {index < sqon.content.length - 1 && <CombinerOperator sqon={sqon} />}
                </div>
              ))}
            </div>

            {/* count */}
            <div className="flex items-center gap-1">
              {fetchTotal.isLoading ? (
                <Spinner />
              ) : (
                <>
                  <VariantIcon size={14} />
                  <span className="font-medium">{numberFormatWithAbbrv(fetchTotal.data?.count ?? 0)}</span>
                </>
              )}
            </div>
          </div>

          {/* actions */}
          <div className={cn('flex items-center py-2 px-3 border-r border-t border-b', backgroundColor)}>
            <Button iconOnly variant="ghost" size="sm" onClick={handleDuplicate}>
              <CopyIcon />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button iconOnly variant="ghost" size="sm">
                  <TrashIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="left" className="w-[200px] space-y-3">
                <div className="text-sm">{t('common.query_bar.delete_popover.title')}</div>
                <div className="flex gap-1 justify-end">
                  <PopoverClose asChild>
                    <Button size="xs" variant="outline">
                      {t('common.query_bar.delete_popover.cancel')}
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button size="xs" variant="destructive" onClick={handleDelete}>
                      {t('common.query_bar.delete_popover.ok')}
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
}

export default QueryBar;
