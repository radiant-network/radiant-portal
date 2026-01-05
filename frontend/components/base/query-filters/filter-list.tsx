import { createContext, useContext, useEffect, useState } from 'react';

import { FilterContainer } from '@/components/base/query-filters/filter-container';
import { Accordion } from '@/components/base/shadcn/accordion';
import { Button } from '@/components/base/shadcn/button';
import { AggregationConfig, ApplicationId } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import { SearchFilter } from './search-filter';

/**
 * Keep appId from ApplicationConfig in memory to be used by filters (multiselect, numeric etc.)
 * to prevent props propagation.
 *
 * appId is must be a key of ApplicationConfig, since it will be used to read the aggregate config
 */
type FilterListContextProps = {
  appId: ApplicationId;
  aggregations: AggregationConfig;
};

export const FilterConfigContext = createContext<FilterListContextProps>({
  appId: ApplicationId.variant_entity,
  aggregations: {},
});

export const useFilterConfig = (): FilterListContextProps => {
  const context = useContext(FilterConfigContext);
  if (!context) {
    throw new Error('useFilterConfig must be used within a FilterConfigProvider');
  }
  return context;
};

/**
 * Generate the global storage key for temporary filter selections
 */
export function getGlobalStorageKey(appId: ApplicationId): string {
  return `temp-filters-${appId}`;
}

/**
 * Create facets
 */
interface FilterListProps {
  groupKey?: string | null;
  aggregations: AggregationConfig;
  appId: ApplicationId;
}

export function FilterList({ groupKey, appId, aggregations }: FilterListProps) {
  const { t } = useI18n();
  const [toggleExpandAll, setToggleExpandAll] = useState<boolean>(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [prevGroupKey, setPrevGroupKey] = useState<string | null | undefined>(groupKey);

  // Unique key for all temporary selections
  const globalStorageKey = getGlobalStorageKey(appId);

  // Simple function to clean all temporary selections
  const clearUnappliedFilters = () => {
    sessionStorage.removeItem(globalStorageKey);
  };

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  const allFields = groupKey
    ? aggregations[groupKey]?.items || []
    : Object.values(aggregations).flatMap(group => group.items);

  // Separate search by filters from other filters
  const searchByFilters = allFields.filter(item => item.type === 'search_by');
  const fields = allFields.filter(item => item.type !== 'search_by');

  useEffect(() => {
    setToggleExpandAll(false);
    setExpandedFilters([]);
  }, [groupKey]);

  // Detect sidebar closure (groupKey → null) OR content change (groupKey1 → groupKey2)
  useEffect(() => {
    // Closure: groupKey goes from a value to null
    if (prevGroupKey && prevGroupKey !== null && groupKey === null) {
      clearUnappliedFilters();
    }
    // Change: groupKey goes from one value to another value
    else if (prevGroupKey && prevGroupKey !== null && groupKey && groupKey !== null && prevGroupKey !== groupKey) {
      clearUnappliedFilters();
    }

    setPrevGroupKey(groupKey);
  }, [groupKey, prevGroupKey]);

  return (
    <FilterConfigContext value={{ appId, aggregations }}>
      <div>
        <div>
          {searchByFilters.map((search, index) => (
            <SearchFilter key={`${search.key}-${index}`} search={search} />
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              const newToggleExpandAll = !toggleExpandAll;
              setToggleExpandAll(newToggleExpandAll);

              if (newToggleExpandAll) {
                setExpandedFilters(fields.map(field => field.key));
              } else {
                setExpandedFilters([]);
              }
            }}
          >
            {toggleExpandAll ? t('common.actions.collapse_all') : t('common.actions.expand_all')}
          </Button>
        </div>
        <Accordion
          className="flex flex-col gap-1"
          type="multiple"
          value={expandedFilters}
          onValueChange={value => setExpandedFilters(value)}
        >
          {fields.map((field, index) => (
            <FilterContainer key={`${field.key}-${index}`} isOpen={expandedFilters.includes(field.key)} field={field} />
          ))}
        </Accordion>
      </div>
    </FilterConfigContext>
  );
}
