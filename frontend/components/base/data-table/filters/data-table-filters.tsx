import { useCallback, useEffect, useMemo } from 'react';
import { ListFilter, X } from 'lucide-react';

import { SearchCriterion } from '@/api/api';
import FilterButton, { IFilterButton, IFilterButtonItem, PopoverSize } from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';
import { StringArrayRecord } from '@/components/hooks/usePersistedFilters';

import { Skeleton } from '../../ui/skeleton';

import TableFiltersSearch, { AutocompleteApiFn } from './data-table-filter-search';

type FilterSearch = {
  placeholder?: string;
  minSearchLength?: number;
  api: AutocompleteApiFn;
};

type CriteriaProps = { key: string; weight: number; visible: boolean };

type DataTableFilters = {
  loading?: boolean;
  openFilters: Record<string, boolean>;
  setOpenFilters: (value: Record<string, boolean>) => void;
  changedFilterButtons: string[];
  setChangedFilterButtons: (value: string[]) => void;
  filters: StringArrayRecord;
  setFilters: (value: StringArrayRecord) => void;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
  filterSearch?: FilterSearch;
  filterButtons: IFilterButton[];
  criterias: Record<string, CriteriaProps>;
  defaultFilters: Record<string, string[]>;
};

/**
 * Should be used by parent component to order options
 */
export function sortOptions(options: IFilterButtonItem[]) {
  return options.sort((a, b) => (a.label as string).localeCompare(b.label as string));
}

/**
 * A reusable function to get the list of visible criterias
 */
export function getVisibleFiltersByCriterias(criterias: Record<string, CriteriaProps>): string[] {
  return Object.keys(criterias).filter(key => criterias[key].visible);
}

/**
 * Mapping function for FilterApi.
 * If a value existing in criteria, the key will be used.
 * - key: key to be send to the api
 * - weight: used to reorder field in render function
 * _code or _id must be added to the correct field
 * @EXAMPLE: {'data_type': {key: 'data_type_code', weight: 1}}
 * @EXAMPLE: {'file_id': {key: 'file_id', weight: 2}}
 */
function updateSearchCriteria(filters: StringArrayRecord, criterias: Record<string, CriteriaProps>): SearchCriterion[] {
  const searchCriteria: SearchCriterion[] = [];
  const quickFilterKeys = Object.keys(criterias);

  for (const key in filters) {
    if (filters[key].length === 0) continue;

    // filters use a mapping criteria. e.g. data_type => data_type_code
    if (quickFilterKeys.includes(key)) {
      searchCriteria.push({ field: criterias[key].key, value: filters[key] });
      continue;
    }

    // autocomplete value, use what the api send
    searchCriteria.push({ field: key, value: filters[key] });
  }

  return searchCriteria;
}

/**
 * Autocomplete values aren't persistent. When requesting a filter through a autocomplete
 * field, we msut clear previous values and only keep the persistent filters (quickfilter, non-autocomplete field)
 */
function getPersistentFilters(filters: StringArrayRecord, criterias: Record<string, CriteriaProps>): StringArrayRecord {
  const persistentFilters: StringArrayRecord = {};
  for (const key in filters) {
    if (Object.keys(criterias).includes(key)) {
      persistentFilters[key] = filters[key];
    }
  }
  return persistentFilters;
}

/**
 * Retrieve the current search term for an autocomplete field
 *
 * @NOTE: there is no multi-select at the moment, so always return the first value
 */
function getSearchTerm(filters: StringArrayRecord, criterias: Record<string, CriteriaProps>): string | undefined {
  for (const key in filters) {
    if (!Object.keys(criterias).includes(key) && filters[key].length > 0) {
      return filters[key][0];
    }
  }

  return undefined;
}

/**
 * Skeleton Loading
 * ButtonFilters can be empty because of useMemo
 * use criterias instead
 */
type FiltersGroupSkeletonProps = {
  filterSearch?: FilterSearch;
  visibleFilters: string[];
};
function FiltersGroupSkeleton({ filterSearch, visibleFilters }: FiltersGroupSkeletonProps) {
  return (
    <div className="flex flex-col justify-start gap-2 min-w-[400px] h-[48px]">
      <Skeleton className="w-[120px] h-[24px]" />
      <div className="flex gap-2 h-[32px]">
        {filterSearch && <Skeleton className="w-[260px] h-full" />}
        {Object.keys(visibleFilters).map(key => (
          <Skeleton key={key} className="w-[100px] h-full" />
        ))}
        {/* more button */}
        <Skeleton className="w-[75px] h-full" />
      </div>
    </div>
  );
}

/**
 * Controlled component
 *
 * His parent component must manage all different filter states, useState
 */
function DataTableFilters({
  loading = false,
  openFilters,
  setOpenFilters,
  filters,
  setFilters,
  changedFilterButtons,
  setChangedFilterButtons,
  setSearchCriteria,
  filterButtons,
  filterSearch,
  criterias,
  defaultFilters,
}: DataTableFilters) {
  const { t } = useI18n();

  /*
   * Handle filter select
   */
  const handleFilterSelect = useCallback(
    (filterKey: string, selectedValues: string[]) => {
      setFilters({ ...filters, [filterKey]: selectedValues });
    },
    [filters, setFilters],
  );

  /*
   * Hidden Filter
   */
  const hiddenFilterOptions = useMemo(
    () => filterButtons.filter((option: IFilterButton) => !option.isVisible),
    [filterButtons],
  );

  /*
   * Check if any filters are active
   */
  const hasActiveFilters =
    filterButtons.some((option: IFilterButton) => option.selectedItems.length > 0) || changedFilterButtons.length > 0;

  /*
   * Clear all filters function
   */
  const clearAllFilters = () => {
    setFilters(defaultFilters);
    setChangedFilterButtons([]);
    setOpenFilters({});
  };

  /*
   * Make filter in more button available in the filter list for the user
   */
  const makeFiltersVisible = useCallback((selectedKeys: string[]) => {
    // Update changed filter buttons to make them visible
    setChangedFilterButtons([
      ...changedFilterButtons,
      ...selectedKeys.filter(key => !changedFilterButtons.includes(key)),
    ]);

    // Set selected filters as open
    const newOpenFilters = selectedKeys.reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setOpenFilters({ ...openFilters, ...newOpenFilters });
  }, []);

  /*
   * Handle autocomplete item selection - only one search term allowed at a time
   */
  const handleAutocompleteSelect = useCallback(
    (type: string, value: string) => {
      // Set the new search term
      setFilters({
        ...getPersistentFilters(filters, criterias),
        [type]: [value],
      });
    },
    [filters, setFilters],
  );

  /*
   * Handle clearing the search input
   */
  const handleSearchClear = useCallback(() => {
    setFilters(getPersistentFilters(filters, criterias));
  }, [filters, setFilters]);

  /*
   * Update searchCriteria
   */
  useEffect(() => {
    setSearchCriteria(updateSearchCriteria(filters, criterias));
  }, [filters, setSearchCriteria]);

  /**
   * Skeleton Loading
   */
  if (loading) {
    return (
      <FiltersGroupSkeleton
        filterSearch={filterSearch}
        visibleFilters={Object.keys(criterias).filter(key => criterias[key].visible)}
      />
    );
  }

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      {filterSearch && (
        <TableFiltersSearch
          onSelect={handleAutocompleteSelect}
          onClear={handleSearchClear}
          selectedValue={getSearchTerm(filters, criterias)}
          placeholder={filterSearch.placeholder}
          minSearchLength={filterSearch.minSearchLength}
          api={filterSearch.api}
        />
      )}
      <div className="flex flex-wrap gap-2 items-end">
        {/* Show visible filters */}
        {filterButtons
          .filter(filter => filter.isVisible)
          .sort((a, b) => criterias[a.key].weight - criterias[b.key].weight)
          .map(filter => (
            <FilterButton
              key={filter.key}
              popoverSize={filter.popoverSize as PopoverSize}
              label={filter.label}
              options={filter.options}
              selected={filter.selectedItems}
              onSelect={values => handleFilterSelect(filter.key, values)}
              isOpen={filter.isOpen}
              withTooltip={filter.withTooltip}
            />
          ))}

        {/* Additional filters control button - only show if there are hidden options */}
        {hiddenFilterOptions.length > 0 && (
          <FilterButton
            label={t('common.filters.more', 'More')}
            options={hiddenFilterOptions}
            selected={[]}
            onSelect={makeFiltersVisible}
            actionMode={true}
            icon={<ListFilter size={16} />}
            placeholder={t('common.table.filters.more_placeholder', 'Filters')}
            closeOnSelect={true}
          />
        )}

        {/* Clear button - only show if filters are active */}
        {hasActiveFilters && (
          <Button variant="link" onClick={clearAllFilters} className="text-sm py-2 px-3 h-8">
            <X size={14} />
            {t('common.actions.clear', 'Clear')}
          </Button>
        )}
      </div>
    </div>
  );
}
export default DataTableFilters;
