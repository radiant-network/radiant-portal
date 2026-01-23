import FilterButton from '@/components/base/buttons/filter-button';
import { useI18n } from '@/components/hooks/i18n';

import { useCasesFilters } from './filters/cases-filters-context';
import ConditionCasesFilter from './filters/condition-cases-filter';

export interface InterpretedCasesFiltersState {
  mondo: string;
  institution: string[];
  test: string[];
  classification: string[];
}

interface CasesFilterBarProps {
  filters: InterpretedCasesFiltersState;
  onFiltersChange: (filters: InterpretedCasesFiltersState) => void;
}

function InterpretedCasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();
  const { filters: casesFilters } = useCasesFilters();

  const handleFilterChange = (field: keyof InterpretedCasesFiltersState, value: string | string[]) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="space-y-2 mb-4 mt-6">
      <div className="flex items-end gap-2">
        <ConditionCasesFilter onChange={value => handleFilterChange('mondo', value)} />
        <FilterButton
          key="classification-filter"
          popoverSize="md"
          label={t('variant_entity.cases.interpreted_table.filters.classification')}
          options={
            casesFilters?.classification.map(classification => ({
              key: classification.key!,
              label: t(`variant.interpretation.classifications.${classification.label}`),
            })) || []
          }
          selected={filters.classification}
          onSelect={selected => handleFilterChange('classification', selected)}
          withTooltip={false}
        />
        <FilterButton
          key="institution-filter"
          popoverSize="md"
          label={t('variant_entity.cases.interpreted_table.filters.institution')}
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
          label={t('variant_entity.cases.interpreted_table.filters.test')}
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

export default InterpretedCasesFilters;
