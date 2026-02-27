/* eslint-disable complexity */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TFunction } from 'i18next';
import isEqual from 'lodash/isEqual';
import { SearchIcon } from 'lucide-react';

import { Aggregation } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import CheckboxFilter from '@/components/base/checkboxes/checkbox-filter';
import { useFacetConfig } from '@/components/base/query-builder-v3/facets/hooks/use-facet-config';
import { Button } from '@/components/base/shadcn/button';
import { CardContent, CardFooter } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Switch } from '@/components/base/shadcn/switch';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { QBActionType, useQBDispatch, useQBHistory, useQBMultiselectValue } from '../hooks/use-query-builder';
import { TermOperators } from '../type';

type MultiFacetProps = {
  field: AggregationConfig;
  maxVisibleItems?: number;
};

/**
 * Wait for api Aggregation to be updated to extend aggregation and make label defined
 */
type MultiSelectAggregation = {
  key: string;
  count: number;
  label: string;
};

/**
 * Add label to aggregations
 */
export function getAggregatesWithLabel(
  aggregations: Aggregation[],
  t: TFunction<string, undefined>,
  sanitize: Function,
  lazyTranslate: Function,
) {
  return aggregations.map(aggregation => ({
    ...aggregation,
    label: t(`common.filters.values.${aggregation.key}.${sanitize(aggregation.key)}`, {
      defaultValue: lazyTranslate(aggregation.key),
    }),
  }));
}

/**
 * Handle search through aggregates
 */
function searchOptions(search: string, aggregates: MultiSelectAggregation[]) {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  return aggregates.filter(option => {
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

/**
 * Compute visible items count
 */
function getVisibleItemsCount(itemLength: number, maxVisibleItems: number) {
  return maxVisibleItems < itemLength ? maxVisibleItems : itemLength;
}

/**
 * Sort aggregation by
 * - Selected by user
 * - Count number
 */
function sortAggregates(qbValues: string[]) {
  return (a: Aggregation, b: Aggregation) => {
    const aApplied = a.key && qbValues.includes(a.key);
    const bApplied = b.key && qbValues.includes(b.key);

    if (aApplied === bApplied) {
      return b.count! - a.count!;
    }

    return aApplied ? -1 : 1;
  };
}

/**
 * Multi select facet
 * - Allow to select multi string value
 * @TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done
 */
export function MultiSelectFacet({ field, maxVisibleItems = 5 }: MultiFacetProps) {
  const { t, sanitize, lazyTranslate } = useI18n();
  const { appId, builderFetcher } = useFacetConfig();
  const dispatch = useQBDispatch();

  const [withDictionaryToggle, setWithDictionaryToggle] = useState<boolean>(false);
  const { data: apiAggregates, isLoading } = builderFetcher({
    field: field.key,
    withDictionary: withDictionaryToggle,
  });

  const history = useQBHistory();
  const defaultItems = useQBMultiselectValue(field.key) as string[];
  const aggregates = useMemo(() => {
    const multiAggregates = (apiAggregates ?? []).map((aggregate: Aggregation) => ({
      ...aggregate,
      label: t(`common.filters.values.${aggregate.key}.${sanitize(aggregate.key)}`, {
        defaultValue: lazyTranslate(aggregate.key),
      }),
    })) as MultiSelectAggregation[];
    return multiAggregates.sort(sortAggregates(defaultItems));
  }, [apiAggregates, defaultItems]);
  const [items, setItems] = useState<MultiSelectAggregation[]>(aggregates);
  const [selectedItems, setSelectedItems] = useState<string[]>(defaultItems);
  const [visibleItemsCount, setVisibleItemsCount] = useState(
    getVisibleItemsCount((apiAggregates ?? []).length, maxVisibleItems),
  );

  /**
   * Search function on all aggregates
   */
  const handleSearch = useCallback(
    (search: string) => {
      if (!search.trim()) {
        setItems(apiAggregates);
        setVisibleItemsCount(getVisibleItemsCount(apiAggregates.length, maxVisibleItems));
        return;
      }

      const results = searchOptions(search, apiAggregates);
      setItems(results);

      if (maxVisibleItems > results.length) {
        setVisibleItemsCount(results.length);
      } else if (results.length > maxVisibleItems) {
        setVisibleItemsCount(maxVisibleItems);
      }
    },
    [maxVisibleItems, apiAggregates],
  );

  const showMore = useCallback(() => {
    setVisibleItemsCount(items.length);
  }, [items]);

  const showLess = useCallback(() => {
    setVisibleItemsCount(maxVisibleItems);
  }, [maxVisibleItems]);

  const selectAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      return;
    }
    setSelectedItems(items.map(f => f.key!));
  }, [items, selectedItems]);

  // Helper function to clear all selections and clean sessionStorage
  const clearAllSelections = useCallback(() => {
    setSelectedItems([]); // Uncheck ALL values (including those from query builder)
  }, [field.key]);

  const unSelectAll = useCallback(() => {
    if (selectedItems.length === 0) {
      return;
    }
    clearAllSelections();
  }, [selectedItems, clearAllSelections]);

  /**
   * Update selected items list when a item checkox is checked
   */
  const handleOnItemCheckedChange = (item: Aggregation) => {
    if (selectedItems.includes(item.key ?? '')) {
      setSelectedItems(selectedItems.filter(f => f !== item.key));
      return;
    }
    setSelectedItems([...selectedItems, item.key!]);
  };

  const reset = useCallback(() => {
    clearAllSelections();
  }, [clearAllSelections]);

  const applyWithOperator = useCallback(
    (operator: TermOperators) => {
      dispatch({
        type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
        payload: {
          content: {
            field: field.key,
            value: [...selectedItems],
          },
          op: operator,
        },
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

  const applySomeNotIn = useCallback(() => {
    applyWithOperator(TermOperators.In);
  }, [applyWithOperator]);

  /**
   * Initialize state when aggregates are loaded
   */
  useEffect(() => {
    if (!isLoading) {
      setItems(aggregates);
      setVisibleItemsCount(getVisibleItemsCount((apiAggregates ?? []).length, maxVisibleItems));
    }
  }, [isLoading, apiAggregates]);

  /**
   * Update only when field has been changed from a remote component
   */
  useEffect(() => {
    if (history.target == field.key) {
      if (!isEqual(defaultItems, selectedItems)) {
        setSelectedItems(defaultItems);
      }
    }
  }, [history.uuid]);

  return (
    <>
      <CardContent size="sm" variant="outline">
        <Input
          startIcon={SearchIcon}
          size="xs"
          type="text"
          placeholder={t('common.filters.search.placeholder')}
          className="w-full text-xs mt-3 py-1.5 px-3 mb-4 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={e => handleSearch(e.target.value)}
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

          {field.withDictionary && (
            <>
              <div className="grow" />
              <Label htmlFor="with-dictionary-switch" className="text-xs">
                {t('common.filters.with_dictionary')}
              </Label>
              <Switch
                id="with-dictionary-switch"
                checked={withDictionaryToggle}
                size="xs"
                onCheckedChange={() => setWithDictionaryToggle(!withDictionaryToggle)}
              />
            </>
          )}
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
            items.slice(0, visibleItemsCount).map(item => (
              <div className="gap-3 py-1.5" key={item.key}>
                <CheckboxFilter
                  size="xs"
                  label={item.label}
                  checked={selectedItems.some(f => f === item.key)}
                  count={item.count}
                  onCheckedChange={() => handleOnItemCheckedChange(item)}
                />
              </div>
            ))}
        </div>

        {!isLoading && items.length > visibleItemsCount && (
          <Button className="mt-2 px-0" onClick={showMore} size="xs" variant="link">
            {t('common.filters.buttons.show_more', { value: thousandNumberFormat(items.length - visibleItemsCount) })}
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
          <Button size="xxs" variant="ghost" onClick={reset} disabled={selectedItems.length === 0 || isLoading}>
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
