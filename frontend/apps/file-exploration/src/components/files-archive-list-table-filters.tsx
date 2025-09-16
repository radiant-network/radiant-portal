import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { DocumentFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import { GroupedAutocompleteResults } from '@/components/base/data-table/filters/data-table-filter-search';
import DataTableFilters, { sortOptions } from '@/components/base/data-table/filters/data-table-filters';
import getDataTypeOptions from '@/components/base/data-table/filters/options/option-data-type';
import getFileFormatOptions from '@/components/base/data-table/filters/options/option-file-format';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { documentApi } from '@/utils/api';

const DEFAULT_VISIBLE_FILTERS = ['project', 'performer_lab', 'relationship_to_proband', 'format', 'data_type'];

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

const CRITERIAS = {
  project: { key: 'project_code', weight: 1 },
  performer_lab: { key: 'performer_lab_code', weight: 2 },
  relationship_to_proband: { key: 'relationship_to_proband_code', weight: 3 },
  format: { key: 'format_code', weight: 4 },
  data_type: { key: 'data_type_code', weight: 5 },
};

/**
 * Autocomplete for document
 */
async function fetchAutocompleteDocuments(prefix: string, minSearchLength: number) {
  if (!prefix || prefix.length < minSearchLength) {
    return {};
  }
  const response = await documentApi.autocompleteDocuments(prefix, '10');
  if (response?.data && response.data.length > 0) {
    const grouped = response.data.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    }, {} as GroupedAutocompleteResults);
    return grouped; // Add explicit return
  }

  return {}; //
}

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
          isVisible: DEFAULT_VISIBLE_FILTERS.includes(key),
          isOpen: openFilters[key] || false,
          selectedItems: filters[key] || [],
          options: sortOptions(apiFilters[key as keyof DocumentFilters] || []),
        };

        switch (key) {
          case 'performer_lab':
            return {
              ...baseOption,
              popoverSize: 'lg' as PopoverSize,
              withTooltip: true,
              options: sortOptions(apiFilters[key] || []),
            };
          case 'data_type':
            return {
              ...baseOption,
              popoverSize: 'md' as PopoverSize,
              options: sortOptions(getDataTypeOptions(apiFilters[key], t) || []),
            };
          case 'format':
            return {
              ...baseOption,
              options: sortOptions(getFileFormatOptions(apiFilters[key], t) || []),
            };
          default:
            return {
              ...baseOption,
              popoverSize: 'sm' as PopoverSize,
              withTooltip: true,
            };
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, openFilters, t]);

  // Get the current search term for display (only one allowed)
  const getSearchTerm = () => {
    const searchTypes = ['id', 'run_name', 'sample_id', 'patient_id', 'case_id', 'task_id'];

    for (const type of searchTypes) {
      const values = filters[type] || [];
      if (values.length > 0) {
        return { type, value: values[0] };
      }
    }

    return null;
  };

  const searchTerm = getSearchTerm();

  return (
    <DataTableFilters
      visibleFilters={DEFAULT_VISIBLE_FILTERS}
      filterSearchs={[
        {
          id: 'search',
          searchTerm: searchTerm?.value,
          minSearchLength: 1,
          placeholder: t('file_entity.search_by_id_placeholder'),
          onAutocomplete: fetchAutocompleteDocuments,
        },
      ]}
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
export default FilesTableFilters;
