/* eslint-disable complexity */
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { CaseFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters, {
  getSortedCriterias,
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
  priority_code: { key: 'priority_code', weight: 1, visible: true },
  status_code: { key: 'status_code', weight: 2, visible: true },
  case_type_code: { key: 'case_type_code', weight: 3, visible: true },
  project_code: { key: 'project_code', visible: false },
  analysis_catalog_code: { key: 'analysis_catalog_code', visible: false },
  diagnosis_lab_code: { key: 'diagnosis_lab_code', visible: false },
  ordering_organization_code: { key: 'ordering_organization_code', visible: false },
  panel_code: { key: 'panel_code', visible: false },
  resolution_status_code: { key: 'resolution_status_code', visible: false },
  life_status_code: { key: 'life_status_code', visible: false },
  case_category_code: { key: 'case_category_code', visible: false },
};

export const FILTER_DEFAULTS = {
  priority_code: [],
  status_code: [],
  case_type_code: [],
  project_code: [],
  analysis_catalog_code: [],
  diagnosis_lab_code: [],
  ordering_organization_code: [],
  panel_code: [],
  resolution_status_code: [],
  life_status_code: [],
  case_category_code: [],
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

    // Order by weight defined in CRITERIAS
    const sortedKeys = getSortedCriterias(CRITERIAS).filter(key => key in apiFilters);

    return sortedKeys.map(key => {
      const baseOption: IFilterButton = {
        key,
        label: t(`case_exploration.case.filters.${key}`),
        isVisible: getVisibleFiltersByCriterias(CRITERIAS).includes(key),
        isOpen: openFilters[key] || false,
        selectedItems: filters[key] || [],
        options: [],
      };

      switch (key) {
        case 'priority_code':
          return {
            ...baseOption,
            options: getItemPriority(apiFilters[key] || []),
          };
        case 'status_code':
          return {
            ...baseOption,
            options: sortOptions(getItemStatus(apiFilters[key] || [], t)),
          };
        case 'case_type_code':
          return {
            ...baseOption,
            options: sortOptions(apiFilters[key] || []),
          };
        case 'project_code':
        case 'analysis_catalog_code':
        case 'diagnosis_lab_code':
        case 'ordering_organization_code':
        case 'panel_code':
          return {
            ...baseOption,
            popoverSize: 'lg' as PopoverSize,
            isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
            options: sortOptions(apiFilters[key] || []),
            withTooltip: true,
          };
        case 'life_status_code':
        case 'case_category_code':
        case 'resolution_status_code':
          return {
            ...baseOption,
            isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
            options: sortOptions(apiFilters[key] || []),
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
