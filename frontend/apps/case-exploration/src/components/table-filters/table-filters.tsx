import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';
import { ListFilter, X } from 'lucide-react';
import FilterButton, { IFilterButton } from '@/components/base/buttons/filter-button';
import { CaseFilters, SearchCriterion } from '@/api/api';
import useSWR from 'swr';
import { caseApi } from '@/utils/api';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { Button } from '@/components/base/ui/button';
import TableFiltersSearch from './table-filters-search';
import filterItemStatus from './filter-item-status';

type CaseFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};


type FiltersGroupFormProps = {
  loading?: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
  searchCriteria: SearchCriterion[];
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
}


function updateSearchCriteria(filters: StringArrayRecord) {
  let search_criteria: SearchCriterion[] = [];
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

function FiltersGroupForm({
  loading = true,
  setSearchCriteria,
  searchCriteria,
}: FiltersGroupFormProps) {
  const [filterButtons, setFilterButtons] = useState<IFilterButton[]>([]);
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>(
    'case-exploration-filters',
    { ...FILTER_DEFAULTS, ...FILTERS_SEARCH_DEFAULTS },
  );
  const { t } = useI18n();

  const { data: apiFilters } = useSWR<CaseFilters, any, CaseFiltersInput>({ search_criteria: searchCriteria }, fetchFilters, {
    revalidateOnFocus: false,
  });

  const getDefaultFilterButtons = useCallback(() => {
    if (!apiFilters) return [];

    return Object.keys(apiFilters).map((key) => {
      const baseOption: IFilterButton = {
        key,
        label: t(`caseExploration.case.filters.${key}`),
        isVisible: ['priority', 'status', 'case_analysis'].includes(key), // Show first three by default
        isOpen: false,
        selectedItems: filters[key] || [],
        options: [],
      };

      switch (key) {
        case 'status':
          return {
            ...baseOption,
            options: filterItemStatus(apiFilters[key] || [], t)
          };
        case 'project':
        case 'performer_lab':
        case 'requested_by':
          return {
            ...baseOption,
            isVisible: ((filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key)) || false,
            options: apiFilters[key] || [],
            withTooltip: true
          };
        case 'priority':
          return {
            ...baseOption,
            options: apiFilters[key] || []
          };
        case 'case_analysis':
          return {
            ...baseOption,
            options: apiFilters[key] || [],
            withTooltip: true
          };
        default:
          return baseOption;
      }
    }).filter(option => option.options.length > 0);
  }, [apiFilters, filters, t]);

  // Update filtersOptions when apiFilters changes
  useEffect(() => {
    setFilterButtons(getDefaultFilterButtons());
  }, [apiFilters, getDefaultFilterButtons]);

  useEffect(() => {
    setSearchCriteria(updateSearchCriteria(filters));
  }, [filters, setSearchCriteria]);

  // Handle filter selection
  const handleFilterSelect = useCallback((filterKey: string, selectedValues: string[]) => {
    setFilters({ ...filters, [filterKey]: selectedValues });
  }, [filters, setFilters]);

  // Handle autocomplete item selection - only one search term allowed at a time
  const handleAutocompleteSelect = useCallback((type: string, value: string) => {
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
  }, [filters, setFilters]);

  // Handle clearing the search input
  const handleSearchClear = useCallback(() => {
    setFilters({
      ...filters,
      ...FILTERS_SEARCH_DEFAULTS,
    });
  }, [filters, setFilters]);

  // Handle showing/hiding additional filters and managing open state
  const makeFiltersVisible = useCallback((selectedKeys: string[]) => {
    const newFilterButtons = filterButtons.map(option => {
      if (selectedKeys.includes(option.key)) {
        // setButtonLayoutChanged(true);
        setChangedFilterButtons([...changedFilterButtons, option.key]);
        return {
          ...option,
          isOpen: true,
          isVisible: true
        }
      }
      return option;
    });
    setFilterButtons(newFilterButtons);
  }, [filterButtons, changedFilterButtons, setChangedFilterButtons]);

  // Get the current search term for display (only one allowed)
  const getSearchTerm = () => {
    const searchTypes = ['case_id', 'patient_id', 'mrn', 'assay_id'];

    for (const type of searchTypes) {
      const values = filters[type] || [];
      if (values.length > 0) {
        return {
          type,
          value: values[0], // Only take the first value since we only allow one
          label: t(`caseExploration.case.headers.${type}`, type.toUpperCase()) + ': ' + values[0]
        };
      }
    }

    return null;
  };

  const hiddenFilterOptions = filterButtons.filter(option => !option.isVisible);
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
    setFilterButtons(getDefaultFilterButtons());
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
        {filterButtons.map((filter) => {
          return filter.isVisible === true ?
            (
              <FilterButton
                key={filter.key}
                label={filter.label}
                options={filter.options}
                selected={filter.selectedItems}
                onSelect={(values) => handleFilterSelect(filter.key, values)}
                isOpen={filter.isOpen}
                withTooltip={filter.withTooltip}
              />
            ) : null;
        })}

        {/* Additional filters control button - only show if there are hidden options */}
        {hiddenFilterOptions.length > 0 && (
          <FilterButton
            label={t('common.filters.more', 'More')}
            options={hiddenFilterOptions}
            selected={[]}
            onSelect={makeFiltersVisible}
            actionMode={true}
            icon={<ListFilter size={16} />}
            placeholder={t('caseExploration.filtersGroup.case.filters.more_placeholder', 'Filters')}
            closeOnSelect={true}
          />
        )}

        {/* Clear button - only show if filters are active */}
        {hasActiveFilters && (
          <Button
            variant="link"
            onClick={clearAllFilters}
            className="text-sm py-2 px-3 h-8"
          >
            <X size={14} />
            {t('common.actions.clear', 'Clear')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default FiltersGroupForm;