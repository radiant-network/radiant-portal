import { useCallback, useEffect, useState } from 'react';

import { type Aggregation, SqonOpEnum } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { CardContent, CardFooter } from '@/components/base/shadcn/card';
import { Label } from '@/components/base/shadcn/label';
import { RadioGroup, RadioGroupItem } from '@/components/base/shadcn/radio-group';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import type { Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { numberFormatWithAbbrv } from '@/components/lib/number-format';

import { QBActionType, useQBBooleanValue, useQBContext, useQBDispatch, useQBHistory } from '../hooks/use-query-builder';

import { useFacetConfig } from './hooks/use-facet-config';

type BooleanFacetProps = {
  field: AggregationConfig;
};

/**
 * @TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done
 */
export function BooleanFacet({ field }: BooleanFacetProps) {
  const { t, sanitize, lazyTranslate } = useI18n();
  const { builderFetcher } = useFacetConfig();
  const { activeQueryId } = useQBContext();
  const dispatch = useQBDispatch();
  const history = useQBHistory();

  const { data: apiAggregates, isLoading } = builderFetcher({
    field: field.key,
  });

  const defaultItem = useQBBooleanValue(field.key);
  const [items, setItems] = useState<Aggregation[]>(apiAggregates ?? []);
  const [selectedItem, setSelectedItem] = useState<string | null>(defaultItem);

  const handleSelect = useCallback(
    (key: string) => {
      if (key === selectedItem) return;

      setSelectedItem(key);

      dispatch({
        type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
        payload: {
          content: {
            field: field.key,
            value: [key],
          },
          op: SqonOpEnum.In,
        },
      });
    },
    [selectedItem],
  );

  const handleClear = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_FACET_PILL,
      payload: {
        content: {
          field: field.key,
          value: [selectedItem],
        },
        op: SqonOpEnum.In,
      },
    });
    setSelectedItem(null);
  }, [selectedItem]);

  useEffect(() => {
    if (apiAggregates) {
      setItems(apiAggregates);
    }
  }, [apiAggregates]);

  /**
   * Update only when field has been changed from a remote component
   */
  useEffect(() => {
    if (history.target == field.key) {
      if (defaultItem !== selectedItem) {
        setSelectedItem(defaultItem);
      }
    }
  }, [history.uuid]);

  /**
   * Update when active query change
   */
  useEffect(() => {
    if (defaultItem !== selectedItem) {
      setSelectedItem(defaultItem);
    }
  }, [activeQueryId]);

  const isFirstLoad = isLoading && items.length === 0;

  return (
    <>
      <CardContent size="sm" variant="outline">
        {isFirstLoad &&
          Array.from({ length: 2 }, (_, i) => (
            <div className="flex justify-between items-center py-2 space-x-2" key={`skeleton-${i}`}>
              <Skeleton className="w-full h-6 rounded" />
              <Skeleton className="h-6 w-12 rounded-md" />
            </div>
          ))}

        {!isLoading && items.length === 0 && (
          <div className="text-muted-foreground py-4">{t('common.facets.no_values_found')}</div>
        )}

        {items.length > 0 && (
          <RadioGroup value={selectedItem ?? ''} onValueChange={handleSelect} className="gap-0 pt-3">
            {items.map(item => {
              const id = `${field.key}-${item.key}`;
              return (
                <div className="flex items-center gap-2 py-1.5" key={item.key}>
                  <RadioGroupItem value={item.key ?? ''} id={id} data-cy={`facet-radio-${field.key}-${item.key}`} />
                  <Label htmlFor={id} className="flex-1 text-xs leading-[14px] cursor-pointer">
                    {t(`common.facets.values.${field.key}.${sanitize(item.key)}`, {
                      defaultValue: lazyTranslate(item.key),
                    })}
                  </Label>
                  <span className="text-muted-foreground font-mono text-xs leading-[14px] text-right min-w-12 ml-auto">
                    {numberFormatWithAbbrv(item.count ?? 0)}
                  </span>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter size="sm">
        <div className="flex align-right justify-end items-center space-x-2">
          <Button
            data-cy={`facet-clear-button-${field.key}`}
            size="2xs"
            variant="ghost"
            onClick={handleClear}
            disabled={selectedItem === null || isLoading}
          >
            {t('common.facets.buttons.clear')}
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
