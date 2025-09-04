import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

import { CaseFilters } from '@/api/api';
import FilterButton, { IFilterButton, IFilterButtonItem, PopoverSize } from '@/components/base/buttons/filter-button';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { caseApi } from '@/utils/api';

// type FilesTableFiltersProps = {};
//
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

async function fetchFilters(searchCriteria: CaseFiltersInput) {
  const response = await caseApi.casesFilters(searchCriteria);
  return response.data;
}

function FilesTableFilters() {
  const { t } = useI18n();
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('case-exploration-filters', {
    ...FILTER_DEFAULTS,
    ...FILTERS_SEARCH_DEFAULTS,
  });

  const { data: apiFilters } = useSWR<CaseFilters>('case-filters', () => fetchFilters({ search_criteria: [] }), {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  // Handle filter selection
  const handleFilterSelect = useCallback(
    (filterKey: string, selectedValues: string[]) => {
      setFilters({ ...filters, [filterKey]: selectedValues });
    },
    [filters, setFilters],
  );

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
            };
          case 'project':
          case 'performer_lab':
          case 'requested_by':
            return {
              ...baseOption,
              popoverSize: 'lg',
              withTooltip: true,
            };
          case 'priority':
            return {
              ...baseOption,
            };
          case 'case_analysis':
            return {
              ...baseOption,
              popoverSize: 'lg',
              withTooltip: true,
            };
          default:
            return baseOption;
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, changedFilterButtons, openFilters, t]);

  console.log('apiFilters', apiFilters);
  console.log('filterButtons', filterButtons);

  return (
    <div id="table-filters" className="py-0 flex flex-2 flex-wrap gap-2 items-button">
      <div className="flex flex-wrap gap-2 items-end">
        {/* Show visible filters */}
        {filterButtons.map(filter =>
          filter.isVisible === true ? (
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
          ) : null,
        )}
      </div>
    </div>
  );
}
export default FilesTableFilters;
