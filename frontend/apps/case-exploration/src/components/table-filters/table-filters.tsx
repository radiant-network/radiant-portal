import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { CaseFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters, { sortOptions } from '@/components/base/data-table/filters/data-table-filters';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { caseApi } from '@/utils/api';

import filterItemPriority from './filter-item-priority';
import filterItemStatus from './filter-item-status';

type CaseFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};

type FiltersGroupFormProps = {
  loading?: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

const CRITERIAS = {
  priority: { key: 'priority_code', weight: 1 },
  status: { key: 'status_code', weight: 2 },
  case_analysis: { key: 'case_analysis_code', weight: 3 },
  project: { key: 'project_code', weight: 3 },
  performer_lab: { key: 'performer_lab_code', weight: 4 },
  requested_by: { key: 'requested_by_code', weight: 5 },
  case_id: { key: 'case_id', weight: 6 },
  patient_id: { key: 'patient_id', weight: 7 },
  mrn: { key: 'mrn', weight: 8 },
  request_id: { key: 'request_id', weight: 9 },
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
              popoverSize: 'lg' as PopoverSize,
              isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
              options: sortOptions(apiFilters[key] || []),
              withTooltip: true,
            };
          case 'priority':
            return {
              ...baseOption,
              options: filterItemPriority(apiFilters[key] || []),
            };
          case 'case_analysis':
            return {
              ...baseOption,
              options: sortOptions(apiFilters[key] || []),
              popoverSize: 'lg' as PopoverSize,
              withTooltip: true,
            };
          default:
            return baseOption;
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, changedFilterButtons, openFilters, t]);

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

  const searchTerm = getSearchTerm();

  return (
    <DataTableFilters
      filterSearchs={[{ id: 'search', searchTerm: searchTerm?.value }]}
      filterButtons={filterButtons}
      changedFilterButtons={changedFilterButtons}
      setChangedFilterButtons={setChangedFilterButtons}
      filters={filters}
      setFilters={setFilters}
      openFilters={openFilters}
      setOpenFilters={setOpenFilters}
      loading={loading}
      setSearchCriteria={setSearchCriteria}
      criterias={CRITERIAS}
      defaultFilters={FILTER_DEFAULTS}
      defaultSearchFilters={FILTERS_SEARCH_DEFAULTS}
    />
  );
}

export default FiltersGroupForm;
