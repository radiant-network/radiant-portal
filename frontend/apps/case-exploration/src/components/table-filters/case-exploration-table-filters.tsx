import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { CaseFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters, {
  getVisibleFiltersByCriterias,
  sortOptions,
} from '@/components/base/data-table/filters/data-table-filters';
import getItemPriority from '@/components/base/data-table/filters/options/option-priority';
import getItemStatus from '@/components/base/data-table/filters/options/option-status';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { caseApi } from '@/utils/api';

type CaseFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};

type FiltersGroupFormProps = {
  loading?: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

const CRITERIAS = {
  priority: { key: 'priority_code', weight: 1, visible: true },
  status: { key: 'status_code', weight: 2, visible: true },
  case_analysis: { key: 'case_analysis_code', weight: 3, visible: true },
  project: { key: 'project_code', visible: false },
  performer_lab: { key: 'performer_lab_code', visible: false },
  requested_by: { key: 'requested_by_code', visible: false },
};

export const FILTER_DEFAULTS = {
  priority: [],
  status: [],
  case_analysis: [],
  project: [],
  performer_lab: [],
  requested_by: [],
};

async function fetchFilters(searchCriteria: CaseFiltersInput) {
  const response = await caseApi.casesFilters(searchCriteria);
  return response.data;
}

function FiltersGroupForm({ loading = true, setSearchCriteria }: FiltersGroupFormProps) {
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('case-exploration-filters', {
    ...FILTER_DEFAULTS,
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

    return Object.keys(apiFilters).map(key => {
      const baseOption: IFilterButton = {
        key,
        label: t(`case_exploration.case.filters.${key}`),
        isVisible: getVisibleFiltersByCriterias(CRITERIAS).includes(key),
        isOpen: openFilters[key] || false,
        selectedItems: filters[key] || [],
        options: [],
      };

      switch (key) {
        case 'status':
          return {
            ...baseOption,
            options: sortOptions(getItemStatus(apiFilters[key] || [], t)),
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
            options: getItemPriority(apiFilters[key] || []),
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
    });
  }, [apiFilters, filters, changedFilterButtons, openFilters, t]);

  return (
    <DataTableFilters
      filterSearch={{
        placeholder: t('case_exploration.filters_group.search_placeholder'),
        minSearchLength: 1,
        api: (prefix: string) => caseApi.autocompleteCases(prefix, '10'),
      }}
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
    />
  );
}

export default FiltersGroupForm;
