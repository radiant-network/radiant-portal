import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';
import { ListFilter, X } from 'lucide-react';
import FilterButton from '@/components/base/buttons/filter-button';
import { AggregationWithIcon } from '@/components/base/buttons/filter-button';
import { CaseFilters, SearchCriterion } from '@/api/api';
import useSWR from 'swr';
import { caseApi } from '@/utils/api';
import { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { Button } from '@/components/base/ui/button';
import TableFiltersSearch from './table-filters-search';
import filterItemStatus from './filter-item-status';

type CaseFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};

interface IFilterOption {
  key: string;
  label: string;
  isVisible: boolean;
  isOpen: boolean;
  selectedItems: string[];
  options: AggregationWithIcon[];
  icon?: any;
  count?: number;
}

type FiltersGroupFormProps = {
  loading?: boolean;
  filters: StringArrayRecord;
  setFilters: (filters: StringArrayRecord) => void;
  searchCriteria: SearchCriterion[];
};

async function fetchFilters(searchCriteria: CaseFiltersInput) {
  const response = await caseApi.casesFilters(searchCriteria);
  return response.data;
}

export const FILTER_DEFAULTS = {
  priority: [],
  status: [],
  caseAnalysis: [],
  project: [],
  performerLab: [],
  requestedBy: [],
};

export const FILTERS_SEARCH_DEFAULTS = {
  case_id: [],
  patient_id: [],
  mrn: [],
  request_id: [],
}

function FiltersGroupForm({
  loading = true,
  filters,
  setFilters,
  searchCriteria,
}: FiltersGroupFormProps) {
  const [filterButtons, setFilterButtons] = useState<IFilterOption[]>([]);
  const [visibleFilters, setVisibleFilters] = useState<string[]>([]);
  const { t } = useI18n();

  const { data: apiFilters } = useSWR<CaseFilters, any, CaseFiltersInput>({ search_criteria: searchCriteria }, fetchFilters, {
    revalidateOnFocus: false,
  });

  // Update filtersOptions when apiFilters changes
  useEffect(() => {
    if (!apiFilters) return;

    const newFiltersOptions: IFilterOption[] = Object.keys(apiFilters).map((key) => {
      const baseOption: IFilterOption = {
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
            isVisible: false,
            options: apiFilters[key] || []
          };
        case 'priority':
        case 'case_analysis':
          return {
            ...baseOption,
            options: apiFilters[key] || []
          };
        default:
          return baseOption;
      }
    }).filter(option => option.options.length > 0); // Only include filters that have options

    setFilterButtons(newFiltersOptions);
  }, [apiFilters]);

  // Update selectedItems and visibility when filters or visibleFilters change
  useEffect(() => {
    setFilterButtons(prev => 
      prev.map(option => {
        const hasSelection = (filters[option.key] || []).length > 0;
        const shouldBeVisible = 
          ['priority', 'status', 'case_analysis'].includes(option.key) || // Always visible
          visibleFilters.includes(option.key) || // Manually made visible
          hasSelection; // Auto-show if has selection
        
        return {
          ...option,
          selectedItems: filters[option.key] || [],
          isVisible: shouldBeVisible
        };
      })
    );
  }, [filters, visibleFilters]);

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
  const handleVisibilitySelect = useCallback((selectedKeys: string[]) => {
    setVisibleFilters(selectedKeys);
    // Update the isOpen state for filters
    setFilterButtons(prev => 
      prev.map(option => ({
        ...option,
        isOpen: selectedKeys.includes(option.key) ? true : false
      }))
    );
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
          label: t(`caseExploration.case.headers.${type}`, type.toUpperCase()) + ': ' + values[0]
        };
      }
    }

    return null;
  };

  // Check if any filters are active
  const hasActiveFilters =
    filterButtons.some(option => option.selectedItems.length > 0) ||
    getSearchTerm() !== null ||
    visibleFilters.length > 0;

  // Clear all filters function
  const clearAllFilters = () => {
    setFilters({
      ...FILTER_DEFAULTS,
      ...FILTERS_SEARCH_DEFAULTS,
    });
    setVisibleFilters([]);
    
    // Reset isOpen state for all filters
    setFilterButtons(prev => 
      prev.map(option => ({
        ...option,
        isOpen: false
      }))
    );
  };

  if (loading) return <FiltersGroupSkeleton />;

  const searchTerm = getSearchTerm();
  const visibleFilterOptions = filterButtons.filter(option => option.isVisible);
  const hiddenFilterOptions = filterButtons.filter(option => !option.isVisible);

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <TableFiltersSearch
        onSelect={handleAutocompleteSelect}
        onClear={handleSearchClear}
        selectedValue={searchTerm?.value}
      />

      <div className="flex flex-wrap gap-2 items-end">
        {/* Show visible filters */}
        {visibleFilterOptions.map((filter) => (
          <FilterButton
            key={filter.key}
            label={filter.label}
            options={filter.options}
            selected={filter.selectedItems}
            onSelect={(values) => handleFilterSelect(filter.key, values)}
            isOpen={filter.isOpen}
          />
        ))}

        {/* Additional filters control button - only show if there are hidden options */}
        {hiddenFilterOptions.length > 0 && (
          <FilterButton
            label={t('common.filters.more', 'More')}
            options={hiddenFilterOptions}
            selected={visibleFilters}
            onSelect={handleVisibilitySelect}
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
