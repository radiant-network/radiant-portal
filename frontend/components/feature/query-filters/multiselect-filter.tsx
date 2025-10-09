import { useCallback, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { Aggregation } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import CheckboxFilter from '@/components/base/checkboxes/checkbox-filter';
import { Button } from '@/components/base/ui/button';
import { CardContent, CardFooter } from '@/components/base/ui/card';
import { Input } from '@/components/base/ui/input';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { useI18n } from '@/components/hooks/i18n';
import { useConfig } from '@/components/model/applications-config';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { IValueFilter, MERGE_VALUES_STRATEGIES, TermOperators } from '@/components/model/sqon';

import { useAggregationBuilder } from './use-aggregation-builder';

interface IProps {
  field: AggregationConfig;
  maxVisibleItems?: number;
}

function searchOptions(search: string, data: any[]) {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  return data.filter(option => {
    const key = option.key.toLowerCase();
    const label = option.label.toLowerCase();
    // Helper to check if all terms appear in order in the string
    function allTermsInOrder(str: string, terms: string[]) {
      let lastIndex = 0;
      for (const term of terms) {
        const idx = str.indexOf(term, lastIndex);
        if (idx === -1) return false;
        lastIndex = idx + term.length;
      }
      return true;
    }
    return allTermsInOrder(key, terms) || allTermsInOrder(label, terms);
  });
}

function getVisibleItemsCount(itemLength: number, maxVisibleItems: number) {
  return maxVisibleItems < itemLength ? maxVisibleItems : itemLength;
}

export function MultiSelectFilter({ field, maxVisibleItems = 5 }: IProps) {
  const { t, sanitize, lazyTranslate } = useI18n();
  const config = useConfig();
  const appId = config.variant_exploration.app_id;

  // Use the hook directly instead of receiving data as a prop
  const { data: aggregationData, isLoading } = useAggregationBuilder(field.key, undefined, true, appId);

  const [items, setItems] = useState<Aggregation[]>(aggregationData || []);
  // items that are include in the search
  const [appliedSelectedItems, setAppliedSelectedItems] = useState<string[]>([]);
  // items that are currently checked
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [visibleItemsCount, setVisibleItemsCount] = useState(getVisibleItemsCount(items.length, maxVisibleItems));
  const [hasUnappliedItems, setHasUnappliedItems] = useState(false);

  useEffect(() => {
    // if page reload and there is item selected in the querybuilder
    const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getResolvedActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => x.content.field === field.key);
    if (prevSelectedItems) {
      setSelectedItems(prevSelectedItems.content.value as string[]);
      setHasUnappliedItems(true);
    } else {
      // update data from upstream, maybe querybuilder flush the selection
      setSelectedItems([]);
    }

    aggregationData?.sort((a, b) => {
      const aSelected = a.key && selectedItems.includes(a.key);
      const bSelected = b.key && selectedItems.includes(b.key);

      if (aSelected === bSelected) {
        return b.count! - a.count!; // Then sort by count
      }

      return aSelected ? -1 : 1;
    });

    /**
     * Lowercase the result
     * Capitalize the First word
     * Ignore word in parenthese
     */
    aggregationData?.forEach(item => {
      item.label = t(`common.filters.values.${field.key}.${sanitize(item.key)}`, {
        defaultValue: lazyTranslate(item.key),
      });
    });

    setItems(aggregationData || []);
    setVisibleItemsCount(getVisibleItemsCount(aggregationData?.length || 0, maxVisibleItems));
  }, [aggregationData, appId, field.key, maxVisibleItems]);

  // Memoize these functions with useCallback
  //
  const updateSearch = useCallback(
    (search: string) => {
      if (!search.trim()) {
        setItems(aggregationData || []);
        setVisibleItemsCount(getVisibleItemsCount(aggregationData?.length || 0, maxVisibleItems));
        return;
      }

      const results = searchOptions(search, aggregationData!);
      if (maxVisibleItems > results.length) {
        setVisibleItemsCount(results.length);
      } else if (results.length > maxVisibleItems) {
        setVisibleItemsCount(maxVisibleItems);
      }
      setItems(results);
    },
    [aggregationData, maxVisibleItems],
  );

  const showMore = useCallback(() => {
    setVisibleItemsCount(items.length);
  }, [visibleItemsCount, items]);

  const showLess = useCallback(() => {
    setVisibleItemsCount(maxVisibleItems);
  }, [visibleItemsCount]);

  const selectAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      return;
    }
    setHasUnappliedItems(true);
    setSelectedItems(items.map(f => f.key!));
  }, [items, selectedItems]);

  const unSelectAll = useCallback(() => {
    if (selectedItems.length === 0) {
      return;
    }
    setHasUnappliedItems(true);
    setSelectedItems([]);
  }, [selectedItems]);

  const itemSelected = useCallback(
    (item: Aggregation) => {
      let newList: string[] = [];
      if (selectedItems.some(f => f === item.key)) {
        newList = selectedItems.filter(f => f !== item.key);
      } else {
        newList = [...selectedItems, item.key!];
      }
      setHasUnappliedItems(true);
      setSelectedItems(newList);
    },
    [selectedItems],
  );

  const reset = useCallback(() => {
    setHasUnappliedItems(false);
    setSelectedItems([...appliedSelectedItems]);
  }, [appliedSelectedItems]);

  const applyWithOperator = useCallback(
    (operator?: TermOperators) => {
      setHasUnappliedItems(false);
      setAppliedSelectedItems(selectedItems);
      queryBuilderRemote.updateActiveQueryField(appId, {
        field: field.key,
        value: [...selectedItems],
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
        operator: operator,
      });
    },
    [selectedItems, appId, field.key],
  );

  const apply = useCallback(() => {
    applyWithOperator(TermOperators.In);
  }, [applyWithOperator]);

  const applyNotIn = useCallback(() => {
    applyWithOperator(TermOperators.NotIn);
  }, [applyWithOperator]);

  const applyAll = useCallback(() => {
    applyWithOperator(TermOperators.All);
  }, [applyWithOperator]);

  const applySomeNotIn = useCallback(() => {
    applyWithOperator(TermOperators.In);
  }, [applyWithOperator]);

  return (
    <>
      <CardContent size="sm" variant="outline">
        <Input
          startIcon={SearchIcon}
          variant="facet"
          type="text"
          placeholder={t('common.filters.search.placeholder')}
          className="w-full text-xs py-1.5 px-3 mb-4 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={e => updateSearch(e.target.value)}
          autoFocus
        />

        <div className="flex gap-2 items-center">
          <Button size="xs" onClick={() => selectAll()} variant="link" className="px-0">
            {t('common.filters.buttons.all')}
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button size="xs" onClick={() => unSelectAll()} variant="link" className="px-0">
            {t('common.filters.buttons.none')}
          </Button>
        </div>

        <div className="max-h-[250px] overflow-auto">
          {/* Loading skeleton state */}
          {isLoading &&
            Array.from({ length: 3 }, (_, i) => (
              <div className="flex justify-between items-center py-2 space-x-2" key={`skeleton-${i}`}>
                <Skeleton className="w-full h-6 rounded" />
                <Skeleton className="h-6 w-12 rounded-md" />
              </div>
            ))}

          {/* No Result Found */}
          {!isLoading && items.length === 0 && (
            <div className="text-muted-foreground py-4">{t('common.filters.no_values_found')}</div>
          )}

          {/* Actual content */}
          {!isLoading &&
            items.length > 0 &&
            Array.from({ length: visibleItemsCount }, (_, i) => (
              <div className="gap-3 py-1.5" key={items[i].key}>
                <CheckboxFilter
                  size="xs"
                  label={t(`common.filters.labels.${field.key}_value.${items[i].key}`, {
                    defaultValue: items[i].label,
                  })}
                  checked={selectedItems.some(f => f === items[i].key)}
                  count={items[i].count}
                  onCheckedChange={() => itemSelected(items[i])}
                />
              </div>
            ))}
        </div>

        {!isLoading && items.length > visibleItemsCount && (
          <Button className="mt-2 px-0" onClick={showMore} size="xs" variant="link">
            {t('common.filters.buttons.show_more', { count: items.length - maxVisibleItems })}
          </Button>
        )}
        {!isLoading && visibleItemsCount > maxVisibleItems && (
          <Button className="mt-2 px-0" onClick={showLess} size="xs" variant="link">
            {t('common.filters.buttons.show_less')}
          </Button>
        )}
      </CardContent>
      <CardFooter size="sm">
        <div className="flex align-right justify-end items-center space-x-2">
          <Button size="xxs" variant="ghost" onClick={reset} disabled={!hasUnappliedItems || isLoading}>
            {t('common.filters.buttons.clear')}
          </Button>
          <div className="flex space-x-2">
            <ActionButton
              size="xxs"
              variant="outline"
              className="h-7"
              color="primary"
              actions={[
                {
                  label: t('common.filters.buttons.some_not_in'),
                  onClick: applySomeNotIn,
                },
                {
                  label: t('common.filters.buttons.all'),
                  onClick: applyAll,
                },
                {
                  label: t('common.filters.buttons.not_in'),
                  onClick: applyNotIn,
                },
              ]}
              onDefaultAction={apply}
              disabled={isLoading}
            >
              {t('common.filters.buttons.apply')}
            </ActionButton>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
