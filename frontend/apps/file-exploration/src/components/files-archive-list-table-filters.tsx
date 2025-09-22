import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { DocumentFilters, SearchCriterion } from '@/api/api';
import { IFilterButton, PopoverSize } from '@/components/base/buttons/filter-button';
import DataTableFilters, {
  getVisibleFiltersByCriterias,
  sortOptions,
} from '@/components/base/data-table/filters/data-table-filters';
import getDataTypeOptions from '@/components/base/data-table/filters/options/option-data-type';
import getFileFormatOptions from '@/components/base/data-table/filters/options/option-file-format';
import getRelationshipOptions from '@/components/base/data-table/filters/options/option-relationship';
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
const FILTER_DEFAULTS = {
  data_type: [],
  format: [],
  project: [],
  performer_lab: [],
  relationship_to_proband: [],
};

const CRITERIAS = {
  project: { key: 'project_code', weight: 1, visible: true },
  performer_lab: { key: 'performer_lab_code', weight: 2, visible: true },
  relationship_to_proband: { key: 'relationship_to_proband_code', weight: 3, visible: true },
  format: { key: 'format_code', weight: 4, visible: true },
  data_type: { key: 'data_type_code', weight: 5, visible: true },
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
          isVisible: getVisibleFiltersByCriterias(CRITERIAS).includes(key),
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
            };
        }
      })
      .filter(option => option.options.length > 0);
  }, [apiFilters, filters, openFilters, t]);

  return (
    <DataTableFilters
      filterSearch={{
        minSearchLength: 1,
        placeholder: t('file_entity.search_by_id_placeholder'),
        api: (prefix: string) => documentApi.autocompleteDocuments(prefix, '10'),
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
export default FilesTableFilters;
