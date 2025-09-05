import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { DocumentFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, IFilterButtonItem, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters, { sortOptions } from '@/components/base/data-table/filters/data-table-filters';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { documentApi } from '@/utils/api';

type FilesTableFilters = {
  loading: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

type DocumentFiltersInput = {
  search_criteria: Array<SearchCriterion>;
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

const FILTER_TO_CRITERIA_MAP = {
  data_type: 'data_type_code',
  format: 'format_code',
  performer_lab: 'performer_lab_code',
  project: 'project_code',
  relationship_to_proband: 'relationship_to_proband_code',
};

async function fetchFilters(searchCriteria: DocumentFiltersInput) {
  const response = await documentApi.documentsFilters(searchCriteria);
  return response.data;
}

function FilesTableFilters({ setSearchCriteria, loading }: FilesTableFilters) {
  const { t } = useI18n();
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('files-filters', {
    ...FILTER_DEFAULTS,
    ...FILTERS_SEARCH_DEFAULTS,
  });
  const { data: apiFilters } = useSWR<DocumentFilters>(
    'document-filters',
    () => fetchFilters({ search_criteria: [] }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  // Mesmoize filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(() => {
    if (!apiFilters) return [];
    return Object.keys(apiFilters)
      .map(key => {
        const baseOption: IFilterButton = {
          key,
          label: t(`files.filters.${key}`),
          isVisible: ['format', 'data_type', 'relationship_to_proband'].includes(key), // Show first three by default
          isOpen: openFilters[key] || false,
          selectedItems: filters[key] || [],
          options: [],
        };

        switch (key) {
          case 'data_type':
          case 'format':
          case 'relationship_to_proband':
            return {
              ...baseOption,
              popoverSize: 'sm' as PopoverSize,
              withTooltip: true,
              options: sortOptions(apiFilters[key] || []),
            };
          case 'performer_lab':
            return {
              ...baseOption,
              isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
              popoverSize: 'lg' as PopoverSize,
              withTooltip: true,
              options: sortOptions(apiFilters[key] || []),
            };
          case 'project':
            return {
              ...baseOption,
              isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
              popoverSize: 'sm' as PopoverSize,
              withTooltip: true,
              options: sortOptions(apiFilters[key] || []),
            };
          default:
            return baseOption;
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, openFilters, t]);

  return (
    <DataTableFilters
      filterButtons={filterButtons}
      changedFilterButtons={changedFilterButtons}
      setChangedFilterButtons={setChangedFilterButtons}
      filters={filters}
      setFilters={setFilters}
      openFilters={openFilters}
      setOpenFilters={setOpenFilters}
      loading={loading}
      setSearchCriteria={setSearchCriteria}
      filterToCriteriaMap={FILTER_TO_CRITERIA_MAP}
    />
  );
}
export default FilesTableFilters;
