import FilterButton from '@/components/base/buttons/filter-button';
import { useI18n } from '@/components/hooks/i18n';

import { useCasesFilters } from './filters/cases-filters-context';
import PhenotypeCasesFilter from './filters/phenotype-cases-filter';

export interface UninterpretedCasesFiltersState {
  phenotype: string;
  institution: string[];
  test: string[];
}

interface CasesFilterBarProps {
  filters: UninterpretedCasesFiltersState;
  onFiltersChange: (filters: UninterpretedCasesFiltersState) => void;
}

function UninterpretedCasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();
  const { filters: casesFilters } = useCasesFilters();

  const handleFilterChange = (field: keyof UninterpretedCasesFiltersState, value: string | string[]) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="space-y-2 mb-4 mt-6">
      <div className="flex items-end gap-2">
        <PhenotypeCasesFilter onChange={value => handleFilterChange('phenotype', value)} />
        <FilterButton
          key="institution-filter"
          popoverSize="md"
          label={t('variant_entity.cases.other_table.filters.institution')}
          options={
            casesFilters?.diagnosis_lab_code.map(lab => ({
              key: lab.key!,
              label: lab.label!,
            })) || []
          }
          selected={filters.institution}
          onSelect={selected => handleFilterChange('institution', selected)}
          withTooltip={false}
        />
        <FilterButton
          key="test-filter"
          popoverSize="md"
          label={t('variant_entity.cases.other_table.filters.test')}
          options={
            casesFilters?.analysis_catalog_code.map(analysis => ({
              key: analysis.key!,
              label: analysis.label!,
            })) || []
          }
          selected={filters.test}
          onSelect={selected => handleFilterChange('test', selected)}
          withTooltip={false}
        />
      </div>
    </div>
  );
}

export default UninterpretedCasesFilters;
