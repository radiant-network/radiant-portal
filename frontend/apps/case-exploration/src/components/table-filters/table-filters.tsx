import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFilter, X } from 'lucide-react';
import useSWR from 'swr';

import { CaseFilters, SearchCriterion } from '@/api/api';
import FilterButton, { IFilterButton, IFilterButtonItem } from '@/components/base/buttons/filter-button';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';
import { Button } from '@/components/base/ui/button';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { caseApi } from '@/utils/api';

import filterItemPriority from './filter-item-priority';
import filterItemStatus from './filter-item-status';
import TableFiltersSearch from './table-filters-search';

type CaseFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};

type FiltersGroupFormProps = {
  loading?: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

async function fetchFilters(searchCriteria: CaseFiltersInput) {
  const response = await caseApi.casesFilters(searchCriteria);
  return response.data;
}

export const FILTER_DEFAULTS = {
  priority: [],
  status: [],
  case_analysis: [],
  project: [],
  performer_lab: [],
  requested_by: [],
};

export const FILTERS_SEARCH_DEFAULTS = {
  case_id: [],
  patient_id: [],
  mrn: [],
  request_id: [],
};

function updateSearchCriteria(filters: StringArrayRecord) {
  const search_criteria: SearchCriterion[] = [];
  if (filters.priority?.length > 0) {
    search_criteria.push({ field: 'priority_code', value: filters.priority });
  }
  if (filters.status?.length > 0) {
    search_criteria.push({ field: 'status_code', value: filters.status });
  }
  if (filters.case_analysis?.length > 0) {
    search_criteria.push({ field: 'case_analysis_code', value: filters.case_analysis });
  }
  if (filters.project?.length > 0) {
    search_criteria.push({ field: 'project_code', value: filters.project });
  }
  if (filters.performer_lab?.length > 0) {
    search_criteria.push({ field: 'performer_lab_code', value: filters.performer_lab });
  }
  if (filters.requested_by?.length > 0) {
    search_criteria.push({ field: 'requested_by_code', value: filters.requested_by });
  }

  // Add search-based criteria
  if (filters.case_id && filters.case_id?.length > 0) {
    search_criteria.push({ field: 'case_id', value: filters.case_id });
  }
  if (filters.patient_id && filters.patient_id?.length > 0) {
    search_criteria.push({ field: 'patient_id', value: filters.patient_id });
  }
  if (filters.mrn && filters.mrn?.length > 0) {
    search_criteria.push({ field: 'mrn', value: filters.mrn });
  }
  if (filters.request_id && filters.request_id?.length > 0) {
    search_criteria.push({ field: 'request_id', value: filters.request_id });
  }
  return search_criteria;
}

function sortOptions(options: IFilterButtonItem[]) {
  return options.sort((a, b) => (a.label as string).localeCompare(b.label as string));
}

function FiltersGroupForm({ loading = true, setSearchCriteria }: FiltersGroupFormProps) {
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('case-exploration-filters', {
    ...FILTER_DEFAULTS,
    ...FILTERS_SEARCH_DEFAULTS,
  });
  const { t } = useI18n();

  const { data: apiFilters } = useSWR<CaseFilters>('case-filters', () => fetchFilters({ search_criteria: [] }), {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  // Memoize filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(() => {
    if (!apiFilters) return [];

    return Object.keys(apiFilters)
      .map(key => {
        const baseOption: IFilterButton = {
          key,
          label: t(`case_exploration.case.filters.${key}`),
          isVisible: ['priority', 'status', 'case_analysis'].includes(key), // Show first three by default
          isOpen: openFilters[key] || false,
          selectedItems: filters[key] || [],
          options: [],
        };

        switch (key) {
          case 'status':
            return {
              ...baseOption,
              options: sortOptions(filterItemStatus(apiFilters[key] || [], t)),
            };
          case 'project':
          case 'performer_lab':
          case 'requested_by':
            return {
              ...baseOption,
              popoverSize: 'lg',
              isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
              options: sortOptions(apiFilters[key] || []),
              withTooltip: true,
            };
          case 'priority':
            return {
              ...baseOption,
              options: filterItemPriority(apiFilters[key] || [], t),
            };
          case 'case_analysis':
            return {
              ...baseOption,
              options: sortOptions(apiFilters[key] || []),
              popoverSize: 'lg',
              withTooltip: true,
            };
          default:
            return baseOption;
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, changedFilterButtons, openFilters, t]);

  useEffect(() => {
    setSearchCriteria(updateSearchCriteria(filters));
  }, [filters, setSearchCriteria]);

  // Handle filter selection
  const handleFilterSelect = useCallback(
    (filterKey: string, selectedValues: string[]) => {
      setFilters({ ...filters, [filterKey]: selectedValues });
    },
    [filters, setFilters],
  );

  // Handle autocomplete item selection - only one search term allowed at a time
  const handleAutocompleteSelect = useCallback(
    (type: string, value: string) => {
      // Clear all existing search terms first
      const clearedFilters = {
        ...filters,
        ...FILTERS_SEARCH_DEFAULTS,
      };

      // Set the new search term
      setFilters({
        ...clearedFilters,
        [type]: [value],
      });
    },
    [filters, setFilters],
  );

  // Handle clearing the search input
  const handleSearchClear = useCallback(() => {
    setFilters({
      ...filters,
      ...FILTERS_SEARCH_DEFAULTS,
    });
  }, [filters, setFilters]);

  // Handle showing/hiding additional filters and managing open state
  const makeFiltersVisible = useCallback((selectedKeys: string[]) => {
    // Update changed filter buttons to make them visible
    setChangedFilterButtons(prev => [...prev, ...selectedKeys.filter(key => !prev.includes(key))]);

    // Set selected filters as open
    const newOpenFilters = selectedKeys.reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setOpenFilters(prev => ({ ...prev, ...newOpenFilters }));
  }, []);

  // Get the current search term for display (only one allowed)
  const getSearchTerm = () => {
    const searchTypes = ['case_id', 'patient_id', 'mrn', 'assay_id'];

    for (const type of searchTypes) {
      const values = filters[type] || [];
      if (values.length > 0) {
        return {
          type,
          value: values[0], // Only take the first value since we only allow one
          label: t(`case_exploration.case.headers.${type}`, type.toUpperCase()) + ': ' + values[0],
        };
      }
    }

    return null;
  };

  const hiddenFilterOptions = useMemo(() => filterButtons.filter(option => !option.isVisible), [filterButtons]);
  const searchTerm = getSearchTerm();

  // Check if any filters are active
  const hasActiveFilters =
    filterButtons.some(option => option.selectedItems.length > 0) ||
    searchTerm !== null ||
    changedFilterButtons.length > 0;

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      ...FILTER_DEFAULTS,
      ...FILTERS_SEARCH_DEFAULTS,
    });
    setChangedFilterButtons([]);
    setOpenFilters({});
  };

  if (loading) return <FiltersGroupSkeleton />;

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <TableFiltersSearch
        onSelect={handleAutocompleteSelect}
        onClear={handleSearchClear}
        selectedValue={searchTerm?.value}
      />

      <div className="flex flex-wrap gap-2 items-end">
        {/* Show visible filters */}
        {filterButtons.map(filter =>
          filter.isVisible === true ? (
            <FilterButton
              key={filter.key}
              popoverSize={filter.popoverSize}
              label={filter.label}
              options={filter.options}
              selected={filter.selectedItems}
              onSelect={values => handleFilterSelect(filter.key, values)}
              isOpen={filter.isOpen}
              withTooltip={filter.withTooltip}
            />
          ) : null,
        )}

        {/* Additional filters control button - only show if there are hidden options */}
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

export default FiltersGroupForm;
