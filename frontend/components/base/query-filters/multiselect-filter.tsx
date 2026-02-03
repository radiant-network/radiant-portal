/* eslint-disable complexity */
import { useCallback, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import { Aggregation } from '@/api/api';
import { ActionButton } from '@/components/base/buttons';
import CheckboxFilter from '@/components/base/checkboxes/checkbox-filter';
import { Button } from '@/components/base/shadcn/button';
import { CardContent, CardFooter } from '@/components/base/shadcn/card';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Switch } from '@/components/base/shadcn/switch';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import { IValueFilter, MERGE_VALUES_STRATEGIES, TermOperators } from '@/components/cores/sqon';
import { useI18n } from '@/components/hooks/i18n';

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

function isWithDictionaryEnabled(field: AggregationConfig, globalStorageKey: string): boolean {
  try {
    const stored = sessionStorage.getItem(globalStorageKey);
    if (stored) {
      const allTempSelections = JSON.parse(stored);
      const dictionaryKey = `${field.key}_withDictionary`;
      if (Object.prototype.hasOwnProperty.call(allTempSelections, dictionaryKey)) {
        return allTempSelections[dictionaryKey];
      }
    }
  } catch (error) {
    console.warn(`Failed to read dictionary toggle state from sessionStorage for ${field.key}:`, error);
  }

  return false;
}

export function MultiSelectFilter({ field, maxVisibleItems = 5 }: IProps) {
  const { t, sanitize, lazyTranslate, i18n } = useI18n();
  const { appId } = useFilterConfig();

  // Unique key for all temporary selections
  const globalStorageKey = getGlobalStorageKey(appId);

  const clearUnappliedFilters = () => {
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        Object.keys(allTempSelections).forEach(key => {
          if (!key.endsWith('_withDictionary')) {
            delete allTempSelections[key];
          }
        });
        if (Object.keys(allTempSelections).length > 0) {
          sessionStorage.setItem(globalStorageKey, JSON.stringify(allTempSelections));
        } else {
          sessionStorage.removeItem(globalStorageKey);
        }
      }
    } catch (error) {
      console.warn('Failed to clear unapplied filters from sessionStorage:', error);
    }
  };

  const [withDictionaryToggle, setWithDictionaryToggle] = useState<boolean>(
    isWithDictionaryEnabled(field, globalStorageKey),
  );

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
    // Check if this is a true page refresh (full reload)
    // We use a flag on window object which doesn't persist across page reloads
    const windowKey = `appLoaded_${appId}`;
    const hasAppLoaded = (window as any)[windowKey];

    if (!hasAppLoaded) {
      // This is a fresh page load - clear all unapplied filters first
      try {
        const stored = sessionStorage.getItem(globalStorageKey);
        if (stored) {
          const allTempSelections = JSON.parse(stored);
          Object.keys(allTempSelections).forEach(key => {
            if (!key.endsWith('_withDictionary')) {
              delete allTempSelections[key];
            }
          });
          if (Object.keys(allTempSelections).length > 0) {
            sessionStorage.setItem(globalStorageKey, JSON.stringify(allTempSelections));
          } else {
            sessionStorage.removeItem(globalStorageKey);
          }
        }
      } catch (error) {
        console.warn('Failed to clear unapplied filters on page refresh:', error);
      }

      // Set flag to indicate app has been loaded
      (window as any)[windowKey] = true;

      // Use query builder values for fresh page load
      const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
        .getResolvedActiveQuery(appId)
        // @ts-ignore
        .content.find((x: IValueFilter) => x.content.field === field.key);
      return (prevSelectedItems?.content.value as string[]) || [];
    }

    // Try sessionStorage first (for normal navigation)
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        // Check if this field exists in sessionStorage (even if empty array)
        if (Object.prototype.hasOwnProperty.call(allTempSelections, field.key)) {
          const fieldSelections = allTempSelections[field.key];
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

  // All items (augmented data)
  const [allItems, setAllItems] = useState<Aggregation[]>(aggregationData || []);
  // Currently displayed items (filtered or all)
  const [items, setItems] = useState<Aggregation[]>(aggregationData || []);
  const [searchTerm, setSearchTerm] = useState<string>('');
  // items that are currently checked
  const [selectedItems, setSelectedItems] = useState<string[]>(getInitialSelectedItems());
  // Number of items currently displayed in the list (controls show more/less functionality)
  const [visibleItemsCount, setVisibleItemsCount] = useState(
    getVisibleItemsCount((aggregationData || []).length, maxVisibleItems),
  );
  // Track if user manually expanded
  const [isManuallyExpanded, setIsManuallyExpanded] = useState<boolean>(false);
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

    // If query builder has changed since last time (and this is not the initial render)
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
  }, [appId, field.key, clearUnappliedFilters, selectedItems]);

  // Additional effect to ensure synchronization when query builder changes
  useEffect(() => {
    // Check if there are values in sessionStorage for this field
    let hasSessionStorageValues = false;
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        hasSessionStorageValues = Object.prototype.hasOwnProperty.call(allTempSelections, field.key);
      }
    } catch (error) {
      // SessionStorage error - continue with synchronization
      console.warn(`Failed to check sessionStorage values for ${field.key}:`, error);
    }

    // Don't synchronize if we have sessionStorage values (user has unapplied changes)
    if (hasSessionStorageValues) {
      return;
    }

    const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getResolvedActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => x.content.field === field.key);

    const queryBuilderItems = (prevSelectedItems?.content.value as string[]) || [];

    // Check if current selectedItems differ from query builder
    const currentSorted = [...selectedItems].sort();
    const queryBuilderSorted = [...queryBuilderItems].sort();

    if (JSON.stringify(currentSorted) !== JSON.stringify(queryBuilderSorted)) {
      // Only update if we don't have pending unapplied changes
      if (!hasUnappliedItems) {
        setSelectedItems(queryBuilderItems);
      }
    }
  }, [appId, field.key, selectedItems, hasUnappliedItems, globalStorageKey]);

  useEffect(() => {
    // Check if there are items in the query builder
    const prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getResolvedActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => x.content.field === field.key);
    const queryBuilderItems = (prevSelectedItems?.content.value as string[]) || [];

    const hasUnapplied = JSON.stringify([...selectedItems].sort()) !== JSON.stringify([...queryBuilderItems].sort());

    setHasUnappliedItems(hasUnapplied);

    // Handle synchronization logic
    if (
      selectedItems.length === 0 &&
      queryBuilderItems.length > 0 &&
      !hasBeenReset &&
      !hasUnappliedItems &&
      !isFromSessionStorage
    ) {
      setSelectedItems(queryBuilderItems);
    }

    // Reset flags
    if (isFromSessionStorage) {
      setIsFromSessionStorage(false);
    }

    // Reset the reset flag if we have selected items
    if (selectedItems.length > 0 && hasBeenReset) {
      setHasBeenReset(false);
    }

    // Get unapplied values from sessionStorage
    let unappliedSessionStorageValues: string[] = [];
    try {
      const stored = sessionStorage.getItem(globalStorageKey);
      if (stored) {
        const allTempSelections = JSON.parse(stored);
        if (Object.prototype.hasOwnProperty.call(allTempSelections, field.key)) {
          unappliedSessionStorageValues = allTempSelections[field.key] || [];
        }
      }
    } catch (error) {
      console.warn(`Failed to read unapplied values from sessionStorage for ${field.key}:`, error);
    }

    // Augment aggregation data
    const augmentedData = [...(aggregationData || [])];
    const allValuesToShow = [...new Set([...queryBuilderItems, ...unappliedSessionStorageValues])];

    if (allValuesToShow.length > 0) {
      allValuesToShow.forEach(value => {
        const existsInData = augmentedData.some(item => item.key === value);
        if (!existsInData) {
          augmentedData.push({
            key: value,
            count: 0,
            label: value,
          });
        }
      });
    }

    // Sort and translate
    augmentedData?.sort((a, b) => {
      const aApplied = a.key && queryBuilderItems.includes(a.key);
      const bApplied = b.key && queryBuilderItems.includes(b.key);

      if (aApplied === bApplied) {
        return b.count! - a.count!;
      }

      return aApplied ? -1 : 1;
    });

    augmentedData?.forEach(item => {
      item.label = t(`common.filters.values.${field.key}.${sanitize(item.key)}`, {
        defaultValue: lazyTranslate(item.key),
      });
    });

    setAllItems(augmentedData || []);

    // Apply search filter if there's a search term
    const filteredItems = searchTerm.trim() ? searchOptions(searchTerm, augmentedData || []) : augmentedData || [];

    setItems(filteredItems);

    // Update visibleItemsCount when data changes
    const targetLength = filteredItems.length;

    // If user manually expanded, preserve the expanded state
    if (isManuallyExpanded && targetLength > maxVisibleItems) {
      setVisibleItemsCount(targetLength);
    } else {
      const newVisibleCount = getVisibleItemsCount(targetLength, maxVisibleItems);
      // Only update if different to avoid infinite loops
      if (visibleItemsCount !== newVisibleCount) {
        setVisibleItemsCount(newVisibleCount);
      }
      // Reset manually expanded state if we're back to default size
      if (isManuallyExpanded && newVisibleCount <= maxVisibleItems) {
        setIsManuallyExpanded(false);
      }
    }
  }, [
    aggregationData,
    appId,
    field.key,
    maxVisibleItems,
    globalStorageKey,
    selectedItems,
    hasBeenReset,
    hasUnappliedItems,
    isFromSessionStorage,
    searchTerm,
    i18n.language,
  ]);

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

  // Save withDictionaryToggle state to sessionStorage
  useEffect(() => {
    if (field.withDictionary) {
      try {
        const stored = sessionStorage.getItem(globalStorageKey) || '{}';
        const allTempSelections = JSON.parse(stored);
        const dictionaryKey = `${field.key}_withDictionary`;
        allTempSelections[dictionaryKey] = withDictionaryToggle;
        sessionStorage.setItem(globalStorageKey, JSON.stringify(allTempSelections));
      } catch (error) {
        console.warn(`Failed to save dictionary toggle state to sessionStorage for ${field.key}:`, error);
      }
    }
  }, [withDictionaryToggle, globalStorageKey, field.key, field.withDictionary]);

  const updateSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      // Reset manual expansion state when searching
      setIsManuallyExpanded(false);

      if (!search.trim()) {
        setItems(allItems);
        setVisibleItemsCount(getVisibleItemsCount(allItems.length, maxVisibleItems));
        return;
      }

      const results = searchOptions(search, allItems);
      setItems(results);

      if (maxVisibleItems > results.length) {
        setVisibleItemsCount(results.length);
      } else if (results.length > maxVisibleItems) {
        setVisibleItemsCount(maxVisibleItems);
      }
    },
    [allItems, maxVisibleItems],
  );

  const showMore = useCallback(() => {
    setVisibleItemsCount(items.length);
    setIsManuallyExpanded(true);
  }, [items]);

  const showLess = useCallback(() => {
    setVisibleItemsCount(maxVisibleItems);
    setIsManuallyExpanded(false);
  }, [maxVisibleItems]);

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

  // Waiting back implementation of "all" operator
  // const applyAll = useCallback(() => {
  //   applyWithOperator(TermOperators.All);
  // }, [applyWithOperator]);

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
          className="w-full text-xs mt-3 py-1.5 px-3 mb-4 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            {t('common.filters.buttons.show_more', { count: items.length - visibleItemsCount })}
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
                // Waiting back implementation of "all" operator
                // {
                //   label: t('common.filters.buttons.all'),
                //   onClick: applyAll,
                // },
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
