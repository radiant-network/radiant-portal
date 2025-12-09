import { useCallback, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { Aggregation } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import CheckboxFilter from '@/components/base/checkboxes/checkbox-filter';
import { Button } from '@/components/base/ui/button';
import { CardContent, CardFooter } from '@/components/base/ui/card';
import { Input } from '@/components/base/ui/input';
import { Label } from '@/components/base/ui/label';
import { Separator } from '@/components/base/ui/separator';
import { Skeleton } from '@/components/base/ui/skeleton';
import { Switch } from '@/components/base/ui/switch';
import { useI18n } from '@/components/hooks/i18n';
import { type Aggregation as AggregationConfig, ApplicationId } from '@/components/model/applications-config';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { IValueFilter, MERGE_VALUES_STRATEGIES, TermOperators } from '@/components/model/sqon';

import { getGlobalStorageKey, useFilterConfig } from './filter-list';
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

function isWithDictionaryEnabled(appId: ApplicationId, field: AggregationConfig): boolean {
  const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
    .getResolvedActiveQuery(appId)
    // @ts-ignore
    .content.find((x: IValueFilter) => x.content.field === field.key);

  if (prevSelectedItems && field.withDictionary) {
    return true;
  }

  return false;
}

export function MultiSelectFilter({ field, maxVisibleItems = 5 }: IProps) {
  const { t, sanitize, lazyTranslate } = useI18n();
  const { appId } = useFilterConfig();

  // Unique key for all temporary selections
  const globalStorageKey = getGlobalStorageKey(appId);

  // Simple function to clean all temporary selections
  const clearUnappliedFilters = () => {
    sessionStorage.removeItem(globalStorageKey);
  };

  // State to manage the dictionary switch value
  const [withDictionaryToggle, setWithDictionaryToggle] = useState(isWithDictionaryEnabled(appId, field));

  // Use the hook directly instead of receiving data as a prop
  const { data: aggregationData, isLoading } = useAggregationBuilder(
    field.key,
    undefined,
    true,
    withDictionaryToggle,
    appId,
  );

  // Initialize selectedItems with query builder + global sessionStorage
  const getInitialSelectedItems = (): string[] => {
    // Try sessionStorage first
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        // Check if this field exists in sessionStorage (even if empty array)
        if (Object.prototype.hasOwnProperty.call(allTempSelections, field.key)) {
          const fieldSelections = allTempSelections[field.key];
          console.error(`[${field.key}] Found in sessionStorage:`, fieldSelections);
          return fieldSelections; // Can be empty array if user unchecked all
        }
      }
    } catch (error) {
      // SessionStorage error - fall back to query builder values
      console.warn(`Failed to read filter state from sessionStorage for ${field.key}:`, error);
    }

    // Otherwise use query builder
    const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getResolvedActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => x.content.field === field.key);

    const queryBuilderItems = (prevSelectedItems?.content.value as string[]) || [];
    return queryBuilderItems;
  };

  const [items, setItems] = useState<Aggregation[]>(aggregationData || []);
  // items that are currently checked
  const [selectedItems, setSelectedItems] = useState<string[]>(getInitialSelectedItems());
  const [visibleItemsCount, setVisibleItemsCount] = useState(getVisibleItemsCount(items.length, maxVisibleItems));
  const [hasUnappliedItems, setHasUnappliedItems] = useState(false);
  const [hasBeenReset, setHasBeenReset] = useState(false);
  const [lastQueryBuilderState, setLastQueryBuilderState] = useState<string>(() => {
    // Initialize with current query builder state to avoid false positive on first render
    const currentQuery = queryBuilderRemote.getResolvedActiveQuery(appId);
    return JSON.stringify(currentQuery);
  });
  const [isFromSessionStorage, setIsFromSessionStorage] = useState(() => {
    // Check if initial values came from sessionStorage
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        return Object.prototype.hasOwnProperty.call(allTempSelections, field.key);
      }
    } catch (error) {
      // SessionStorage error - assume values don't come from storage
      console.warn(`Failed to check sessionStorage state for ${field.key}:`, error);
    }
    return false;
  });

  // Monitor query builder changes to clean sessionStorage
  useEffect(() => {
    const currentQuery = queryBuilderRemote.getResolvedActiveQuery(appId);
    const currentQueryString = JSON.stringify(currentQuery);

    // If query builder has changed since last time
    if (lastQueryBuilderState && lastQueryBuilderState !== currentQueryString) {
      // Clear sessionStorage as query builder state was modified by external action
      clearUnappliedFilters();

      // Update selectedItems with new query builder values
      const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
        .getResolvedActiveQuery(appId)
        // @ts-ignore
        .content.find((x: IValueFilter) => x.content.field === field.key);

      const queryBuilderItems = (prevSelectedItems?.content.value as string[]) || [];
      setSelectedItems(queryBuilderItems);
    }

    setLastQueryBuilderState(currentQueryString);
  }, [appId, field.key, clearUnappliedFilters, lastQueryBuilderState]);

  useEffect(() => {
    // Check if there are items in the query builder
    const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getResolvedActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => x.content.field === field.key);

    // Determine if there are unapplied items
    const queryBuilderItems = (prevSelectedItems?.content.value as string[]) || [];
    const hasUnapplied = JSON.stringify([...selectedItems].sort()) !== JSON.stringify([...queryBuilderItems].sort());

    setHasUnappliedItems(hasUnapplied);

    // Synchronize only if selectedItems is empty and there are items in query builder
    // AND it's not following a reset AND user hasn't made any changes yet
    // AND values didn't come from sessionStorage initially
    if (
      selectedItems.length === 0 &&
      queryBuilderItems.length > 0 &&
      !hasBeenReset &&
      !hasUnappliedItems &&
      !isFromSessionStorage
    ) {
      setSelectedItems(queryBuilderItems);
    }

    // Reset the sessionStorage flag after first effect run
    if (isFromSessionStorage) {
      setIsFromSessionStorage(false);
    }

    // Reset the reset flag if we have selected items
    if (selectedItems.length > 0 && hasBeenReset) {
      setHasBeenReset(false);
    }

    // Get only applied filters from query builder for ordering
    const appliedFilterItems: string[] = (() => {
      const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
        .getResolvedActiveQuery(appId)
        // @ts-ignore
        .content.find((x: IValueFilter) => x.content.field === field.key);
      return (prevSelectedItems?.content.value as string[]) || [];
    })();

    aggregationData?.sort((a, b) => {
      const aApplied = a.key && appliedFilterItems.includes(a.key);
      const bApplied = b.key && appliedFilterItems.includes(b.key);

      if (aApplied === bApplied) {
        return b.count! - a.count!; // Then sort by count
      }

      return aApplied ? -1 : 1;
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
  }, [aggregationData, appId, field.key, maxVisibleItems, selectedItems]);

  // Save temporarily in global sessionStorage
  useEffect(() => {
    // Always save the current state (even empty array) to mark that user has interacted
    try {
      const stored = sessionStorage.getItem(globalStorageKey) || '{}';
      const allTempSelections = JSON.parse(stored);
      allTempSelections[field.key] = selectedItems;
      sessionStorage.setItem(globalStorageKey, JSON.stringify(allTempSelections));
    } catch (error) {
      // SessionStorage error - filter state won't persist, but component still works
      console.warn(`Failed to save filter state to sessionStorage for ${field.key}:`, error);
    }
  }, [selectedItems, globalStorageKey, field.key]);

  // Clean sessionStorage on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(globalStorageKey);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [globalStorageKey]);

  // Memoize these functions with useCallback
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

  // Helper function to clear all selections and clean sessionStorage
  const clearAllSelections = useCallback(() => {
    setHasUnappliedItems(true); // There will be unapplied changes after clear
    setSelectedItems([]); // Uncheck ALL values (including those from query builder)
    setHasBeenReset(true); // Mark that a reset occurred to avoid re-synchronization
    // Clean from global object
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        delete allTempSelections[field.key];
        if (Object.keys(allTempSelections).length === 0) {
          sessionStorage.removeItem(globalStorageKey);
        } else {
          sessionStorage.setItem(globalStorageKey, JSON.stringify(allTempSelections));
        }
      }
    } catch (error) {
      // SessionStorage error - clear operation failed, but component state is still reset
      console.warn(`Failed to clear filter state from sessionStorage for ${field.key}:`, error);
    }
  }, [globalStorageKey, field.key]);

  const unSelectAll = useCallback(() => {
    if (selectedItems.length === 0) {
      return;
    }
    clearAllSelections();
  }, [selectedItems, clearAllSelections]);

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
    clearAllSelections();
  }, [clearAllSelections]);

  const applyWithOperator = useCallback(
    (operator?: TermOperators) => {
      setHasUnappliedItems(false);
      setHasBeenReset(false); // Reset the reset flag
      queryBuilderRemote.updateActiveQueryField(appId, {
        field: field.key,
        value: [...selectedItems],
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
        operator: operator,
      });
      // Clean all temporary selections after apply
      clearUnappliedFilters();
    },
    [selectedItems, appId, field.key, clearUnappliedFilters],
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
          size="xs"
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

          {field.withDictionary && (
            <>
              <div className="flex-grow" />
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
