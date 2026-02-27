import { Fragment, useCallback } from 'react';
import { CopyIcon, TrashIcon } from 'lucide-react';
import useSWR from 'swr';

import { Count, SqonContent, SqonOpEnum } from '@/api/api';
import VariantIcon from '@/components/base/icons/variant-icon';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Spinner } from '@/components/base/shadcn/spinner';
import { TSyntheticSqonContentValue } from '@/components/cores/sqon';
import { useI18n } from '@/components/hooks/i18n';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';
import { cn } from '@/components/lib/utils';

import { Button } from '../shadcn/button';

import { QBActionType, useQBContext, useQBDispatch } from './hooks/use-query-builder';
import MultiSelectQueryPill from './pills/multiselect-query-pill';
import CombinerOperator from './pills/operators/combiner-operator';
import { ISyntheticSqon, IValueFacet } from './type';

/**
 * Type
 */
type QueryBarProps = {
  sqon: ISyntheticSqon;
  active: boolean;
};

/**
 * Simple factory design pattern to create the correct query-pill
 */
function factory(content: TSyntheticSqonContentValue, displayCombiner: boolean) {
  return (
    <div className="flex mt-1">
      <MultiSelectQueryPill content={content as IValueFacet} /> {displayCombiner && <CombinerOperator />}
    </div>
  );
}

/**
 * Represent a single query.
 * A query is a combinaison of multiple sqon (multi-select, numerical, boolean etc.)
 *
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >][X]      | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *
 */
function QueryBar({ sqon, active }: QueryBarProps) {
  const { t } = useI18n();
  const { fetcher } = useQBContext();
  const dispatch = useQBDispatch();
  const backgroundColor = useCallback(
    () => ({
      'border-primary/75 bg-primary/10': active,
      'border-muted-foreground/20 bg-muted/35 text-muted-foreground': !active,
    }),
    [active],
  )();

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
   * Actions
   */
  const handleSelection = useCallback(() => {
    console.warn('QueryBar:handleSelection has not be implemented');
  }, [sqon]);
  const handleDuplicate = useCallback(() => {
    console.warn('QueryBar:handleDuplicate has not be implemented');
  }, [sqon]);

  const handleDelete = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_QUERY,
      payload: sqon,
    });
  }, [sqon]);

  return (
    <div className="flex flex-1 group/query" data-query-active={active}>
      {/* selector */}
      <div className={cn('flex gap-2 items-center py-4 px-4 border-l border-t border-b', backgroundColor)}>
        <Checkbox size="sm" checked={false} onClick={handleSelection} />
        <span className="text-xs font-medium">{t('common.query_bar.selector', { index: 1 })}</span>
      </div>

      {/* query */}
      <div className={cn('flex flex-1 justify-between py-3 px-3 border', backgroundColor)}>
        <div className="flex flex-1 flex-wrap max-h-[30vh]">
          {sqon.content.map((content, index) => (
            <Fragment key={index}>{factory(content, index < sqon.content.length - 1)}</Fragment>
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
      <div
        className={cn('flex items-center py-2 px-3 border-r border-t border-b', backgroundColor)}
        onClick={e => e.stopPropagation()}
      >
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
    </div>
  );
}

export default QueryBar;
