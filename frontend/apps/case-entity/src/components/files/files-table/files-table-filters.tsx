import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { DocumentFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters, { sortOptions } from '@/components/base/data-table/filters/data-table-filters';
import getDataTypeOptions from '@/components/base/data-table/filters/options/option-data-type';
import getFileFormatOptions from '@/components/base/data-table/filters/options/option-file-format';
import getRelationshipOptions from '@/components/base/data-table/filters/options/option-relationship';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { caseApi } from '@/utils/api';

const DEFAULT_VISIBLE_FILTERS = ['format', 'data_type', 'relationship_to_proband'];

type FilesTableFilters = {
  caseId: string;
  loading: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

type DocumentFiltersInput = {
  search_criteria: Array<SearchCriterion>;
};

export const FILTER_DEFAULTS = {
  format: [],
  data_type: [],
  relationship_to_proband: [],
};

const CRITERIAS = {
  format: { key: 'format_code', weight: 1, visible: true },
  data_type: { key: 'data_type_code', weight: 2, visible: true },
  relationship_to_proband: { key: 'relationship_to_proband_code', weight: 3, visible: true },
};

async function fetchFilters(caseId: string, searchCriteria: DocumentFiltersInput) {
  const response = await caseApi.caseEntityDocumentsFilters(caseId, searchCriteria);
  return response.data;
}

function FilesTableFilters({ caseId, setSearchCriteria, loading }: FilesTableFilters) {
  const { t } = useI18n();
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('files-filters', {
    ...FILTER_DEFAULTS,
  });
  const { data: apiFilters } = useSWR<DocumentFilters>(
    'document-filters',
    () => fetchFilters(caseId, { search_criteria: [] }),
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
    return Object.keys(apiFilters).map(key => {
      const baseOption: IFilterButton = {
        key,
        label: t(`files.filters.${key}`),
        isVisible: DEFAULT_VISIBLE_FILTERS.includes(key), // Show first three by default
        isOpen: openFilters[key] || false,
        selectedItems: filters[key] || [],
        options: [],
      };

      switch (key) {
        case 'data_type':
          return {
            ...baseOption,
            popoverSize: 'md' as PopoverSize,
            options: sortOptions(getDataTypeOptions(apiFilters[key], t) || []),
          };
        case 'relationship_to_proband':
          return {
            ...baseOption,
            popoverSize: 'xs' as PopoverSize,
            options: sortOptions(getRelationshipOptions(apiFilters[key]) || []),
          };
        case 'format':
          return {
            ...baseOption,
            options: sortOptions(getFileFormatOptions(apiFilters[key], t) || []),
          };
        default:
          return {
            ...baseOption,
            withTooltip: true,
            options: sortOptions(apiFilters[key as keyof DocumentFilters] || []),
          };
      }
    });
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
      criterias={CRITERIAS}
      defaultFilters={FILTER_DEFAULTS}
    />
  );
}
export default FilesTableFilters;
