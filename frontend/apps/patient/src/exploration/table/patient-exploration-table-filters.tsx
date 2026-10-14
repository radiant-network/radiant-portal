/* eslint-disable complexity */
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import type { SearchCriterion } from '@/api/api';
import type { IFilterButton } from '@/components/base/buttons/filter-button';
import DataTableFilters, {
  getSortedCriterias,
  getVisibleFiltersByCriterias,
  sortOptions,
} from '@/components/base/data-table/filters/data-table-filters';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import usePersistedFilters, { type StringArrayRecord } from '@/components/hooks/usePersistedFilters';
import { patientsApi } from '@/utils/api';

import { fetchPatientFilters, type PatientFilters } from '../../api/patient';

type FiltersGroupFormProps = {
  loading?: boolean;
  setSearchCriteria: (searchCriteria: SearchCriterion[]) => void;
};

const CRITERIAS = {
  vital_status: { key: 'vital_status', weight: 1, visible: true },
  organization_code: { key: 'organization_code', weight: 2, visible: true },
  cns_integrated_diagnosis: { key: 'cns_integrated_diagnosis', weight: 3, visible: true },
  protocol: { key: 'protocol', weight: 4, visible: true },
  molecular_subtype: { key: 'molecular_subtype', weight: 5, visible: true },
  age_at_initial_dx_days: { key: 'age_at_initial_dx_days', weight: 6, visible: true },
  had_initial_methotrexate: { key: 'had_initial_methotrexate', weight: 7, visible: true },
  had_initial_radiation: { key: 'had_initial_radiation', weight: 8, visible: true },
  diagnosis_type_cohort: { key: 'diagnosis_type_cohort', visible: false },
};

export const FILTER_DEFAULTS: StringArrayRecord = {
  vital_status: [],
  organization_code: [],
  cns_integrated_diagnosis: [],
  protocol: [],
  molecular_subtype: [],
  age_at_initial_dx_days: [],
  had_initial_methotrexate: [],
  had_initial_radiation: [],
  diagnosis_type_cohort: [],
};

function FiltersGroupForm({ loading = true, setSearchCriteria }: FiltersGroupFormProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const [changedFilterButtons, setChangedFilterButtons] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = usePersistedFilters<StringArrayRecord>('patient-exploration-filters', {
    ...FILTER_DEFAULTS,
  });

  const { data: apiFilters } = useSWR<PatientFilters>('patient-filters', fetchPatientFilters, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const filterButtons = useMemo(() => {
    if (!apiFilters) return [];

    const sortedKeys = getSortedCriterias(CRITERIAS).filter(key => key in apiFilters);

    return sortedKeys.map(key => {
      const typedKey = key as keyof PatientFilters;
      const baseOption: IFilterButton = {
        key,
        label: t(`patient_exploration.filters.${key}`),
        isVisible: getVisibleFiltersByCriterias(CRITERIAS).includes(key),
        isOpen: openFilters[key] || false,
        selectedItems: filters[key] || [],
        options: [],
      };

      switch (key) {
        case 'diagnosis_type_cohort':
          return {
            ...baseOption,
            isVisible: (filters[key] && filters[key].length > 0) || changedFilterButtons.includes(key) || false,
            options: sortOptions(apiFilters[typedKey] || []),
          };
        default:
          return {
            ...baseOption,
            options: sortOptions(apiFilters[typedKey] || []),
          };
      }
    });
  }, [apiFilters, filters, changedFilterButtons, openFilters, t]);

  return (
    <DataTableFilters
      filterSearch={{
        placeholder: t('patient_exploration.search_placeholder'),
        api: (prefix: string) => patientsApi.autocompletePatients(tenant, prefix, '10'),
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
