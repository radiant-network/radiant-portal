import { useMemo, useState } from 'react';
import useSWR from 'swr';

import { SearchCriterion, VariantCasesFilters } from '@/api/index';
import { IFilterButton } from '@/components/base/buttons/filter-button';
import DataTableFilters, {
  getSortedCriterias,
  getVisibleFiltersByCriterias,
  sortOptions,
} from '@/components/base/data-table/filters/data-table-filters';
import getItemTransmissionMode from '@/components/base/data-table/filters/options/option-transmission-mode';
import getItemZygosity from '@/components/base/data-table/filters/options/option-zygosity';
import { useI18n } from '@/components/hooks/i18n';
import usePersistedFilters, { StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { variantsApi } from '@/utils/api';

interface UninterpretedCasesTableFiltersProps {
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
  loading?: boolean;
}

export const FILTER_DEFAULTS = {
  filter_is_pass: [],
  diagnosis_lab_code: [],
  zygosity: [],
  transmission_mode: [],
  analysis_catalog_code: [],
  sex_code: [],
};

const CRITERIAS = {
  diagnosis_lab_code: { key: 'diagnosis_lab_code', weight: 1, visible: true },
  filter_is_pass: { key: 'filter_is_pass', weight: 2, visible: true },
  zygosity: { key: 'zygosity', weight: 3, visible: true },
  transmission_mode: { key: 'transmission_mode', weight: 4, visible: true },
  analysis_catalog_code: { key: 'analysis_catalog_code', weight: 5, visible: false },
  sex_code: { key: 'sex_code', weight: 6, visible: false },
};

async function fetchFilters() {
  const response = await variantsApi.getGermlineVariantCasesFilters();
  return response.data;
}

function UninterpretedCasesTableFilters({ setSearchCriteria, loading }: UninterpretedCasesTableFiltersProps) {
  const { t } = useI18n();
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('uninterpreted-cases-filters', {
    ...FILTER_DEFAULTS,
  });
  const { data: apiFilters } = useSWR<VariantCasesFilters>('uninterpreted-cases-filters', fetchFilters, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const filterButtons = useMemo(() => {
    if (!apiFilters) return [];

    // Order by weight defined in CRITERIAS
    const sortedKeys = getSortedCriterias(CRITERIAS);

    return sortedKeys.map(key => {
      const baseOption: IFilterButton = {
        key,
        label: t(`variant_entity.cases.other_table.filters.${key}`),
        isVisible: getVisibleFiltersByCriterias(CRITERIAS).includes(key),
        isOpen: openFilters[key] || false,
        selectedItems: filters[key] || [],
        options: [],
      };

      switch (key) {
        case 'diagnosis_lab_code':
          return {
            ...baseOption,
            options: sortOptions(apiFilters[key] || []),
          };

        case 'analysis_catalog_code':
        case 'sex_code':
          return {
            ...baseOption,
            isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
            options: sortOptions(apiFilters[key] || []),
          };

        case 'zygosity':
          return {
            ...baseOption,
            options: sortOptions(getItemZygosity(apiFilters[key] || [], t)),
          };

        case 'transmission_mode':
          return {
            ...baseOption,
            options: sortOptions(getItemTransmissionMode(apiFilters[key] || [], t)),
          };

        case 'filter_is_pass':
          return {
            ...baseOption,
            options: [
              { key: 'true', label: t('variant_entity.cases.other_table.filters.filter_pass') },
              { key: 'false', label: t('variant_entity.cases.other_table.filters.filter_fail') },
            ],
          };

        default:
          return baseOption;
      }
    });
  }, [apiFilters, filters, openFilters, t]);

  return (
    <DataTableFilters
      // filterSearch={{
      //   minSearchLength: 1,
      //   placeholder: t('variant_entity.cases.other_table.filters.search_hpo_placeholder'),
      //   api: (prefix: string) => variantsApi.autocompletePhenotype(prefix, '10'),
      // }}
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

export default UninterpretedCasesTableFilters;
