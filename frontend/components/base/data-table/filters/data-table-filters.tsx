import { useCallback, useEffect, useMemo } from 'react';
import { ListFilter, X } from 'lucide-react';

import { SearchCriterion } from '@/api/api';
import FilterButton, { IFilterButton, IFilterButtonItem, PopoverSize } from '@/components/base/buttons/filter-button';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';
import { StringArrayRecord } from '@/components/hooks/usePersistedFilters';

import { Skeleton } from '../../ui/skeleton';

type DataTableFilters = {
  loading?: boolean;
  openFilters: Record<string, boolean>;
  setOpenFilters: (value: Record<string, boolean>) => void;
  changedFilterButtons: string[];
  setChangedFilterButtons: (value: string[]) => void;
  filters: StringArrayRecord;
  setFilters: (value: StringArrayRecord) => void;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
  filterButtons: IFilterButton[];
  filterToCriteriaMap: Record<string, string>;
};

export const FILTER_DEFAULTS = {
  data_type: [],
  format: [],
  project: [],
  performer_lab: [],
  relationship_to_proband: [],
};

export const FILTERS_SEARCH_DEFAULTS = {
  data_type: [],
  format: [],
  project: [],
  performer_lab: [],
  relationship_to_proband: [],
};

/**
 * Should be used by parent component to order options
 */
export function sortOptions(options: IFilterButtonItem[]) {
  return options.sort((a, b) => (a.label as string).localeCompare(b.label as string));
}

/**
 * Mapping function for FilterApi.
 * _code or _id must be added to the correct field
 * @EXAMPLE: {'data_type': 'data_type_code'}
 * @EXAMPLE: {'file': 'file_id'}
 */
function updateSearchCriteria(
  filters: StringArrayRecord,
  filterToCriteriaMap: Record<string, string>,
): SearchCriterion[] {
  const searchCriteria: SearchCriterion[] = [];
  for (const key in filterToCriteriaMap) {
    if (filters[key].length > 0) {
      searchCriteria.push({ field: filterToCriteriaMap[key], value: filters[key] });
    }
  }

  return searchCriteria;
}

/**
 * Skeleton Loading
 */
type FiltersGroupSkeletonProps = {
  hasAutocomplete?: boolean;
  filterButtons: IFilterButton[];
};
function FiltersGroupSkeleton({ hasAutocomplete, filterButtons }: FiltersGroupSkeletonProps) {
  return (
    <div className="flex flex-col justify-start gap-2 min-w-[400px] h-[48px]">
      {hasAutocomplete && (
        <div className="flex h-[24px]">
          <Skeleton className="w-[120px] h-full" />
        </div>
      )}
      <div className="flex gap-2 h-[32px]">
        {filterButtons.map(button => (
          <Skeleton key={button.key} className="w-[150px] h-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Controlled component
 *
 * His parent component must manage all different filter states, useState
 *
 * @TODO: Add autocomplete field
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
  filterToCriteriaMap,
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
    setFilters({
      ...FILTER_DEFAULTS,
      ...FILTERS_SEARCH_DEFAULTS,
    });
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
   * Update searchCriteria
   * Call the API
   */
  useEffect(() => {
    setSearchCriteria(updateSearchCriteria(filters, filterToCriteriaMap));
  }, [filters, setSearchCriteria]);

  /**
   * Skeleton Loading
   */
  if (loading) return <FiltersGroupSkeleton filterButtons={filterButtons.filter(filter => filter.isVisible)} />;

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <div className="flex flex-wrap gap-2 items-end">
        {/* Show visible filters */}
        {filterButtons
          .filter(filter => filter.isVisible)
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
        {/* @TODO: Update placeholder translation key to a generic one */}
        {hiddenFilterOptions.length > 0 && (
          <FilterButton
            label={t('common.filters.more', 'More')}
            options={hiddenFilterOptions}
            selected={[]}
            onSelect={makeFiltersVisible}
            actionMode={true}
            icon={<ListFilter size={16} />}
            placeholder={t('case_exploration.filters_group.case.filters.more_placeholder', 'Filters')}
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
