import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { DocumentFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, IFilterButtonItem, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters from '@/components/base/data-table/filters/data-table-filters';
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

async function fetchFilters(searchCriteria: DocumentFiltersInput) {
  const response = await documentApi.documentsFilters(searchCriteria);
  return response.data;
}

function updateSearchCriteria(filters: StringArrayRecord) {
  const search_criteria: SearchCriterion[] = [];
  if (filters.data_type?.length > 0) {
    search_criteria.push({ field: 'data_type_code', value: filters.data_type });
  }
  if (filters.format?.length > 0) {
    search_criteria.push({ field: 'data_type_code', value: filters.format });
  }
  if (filters.performer_lab?.length > 0) {
    search_criteria.push({ field: 'performer_lab_code', value: filters.performer_lab });
  }
  if (filters.project?.length > 0) {
    search_criteria.push({ field: 'project_code', value: filters.project });
  }
  if (filters.relationship_to_proband?.length > 0) {
    search_criteria.push({ field: 'relationship_to_proband_code', value: filters.relationship_to_proband });
  }

  return search_criteria;
}

function sortOptions(options: IFilterButtonItem[]) {
  return options.sort((a, b) => (a.label as string).localeCompare(b.label as string));
}

function FilesTableFilters({ setSearchCriteria, loading }: FilesTableFilters) {
  const { t } = useI18n();
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
          case 'project':
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
              popoverSize: 'lg' as PopoverSize,
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
      filters={filters}
      setFilters={setFilters}
      setOpenFilters={setOpenFilters}
      loading={loading}
      updateSearchCriteria={updateSearchCriteria}
      setSearchCriteria={setSearchCriteria}
      filterButtons={filterButtons}
    />
  );
}
export default FilesTableFilters;
