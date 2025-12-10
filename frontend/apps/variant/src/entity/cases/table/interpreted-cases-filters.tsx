import { useI18n } from '@/components/hooks/i18n';

import AnalysisSelectFilter from './filters/analysis-select-filter';
import ClassificationSelectFilter from './filters/classification-select-filter';
import ConditionCasesFilter from './filters/condition-cases-filter';
import InstitutionSelectFilter from './filters/institution-select-filter';

export interface InterpretedCasesFiltersState {
  mondo: string;
  institution: 'all' | string;
  test: 'all' | string;
  classification: 'all' | string;
}

interface CasesFilterBarProps {
  filters: InterpretedCasesFiltersState;
  onFiltersChange: (filters: InterpretedCasesFiltersState) => void;
}

function InterpretedCasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();

  const handleFilterChange = (field: keyof InterpretedCasesFiltersState, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="space-y-2">
      <div className="text-sm">{t('variant_entity.cases.interpreted_table.filters.label')}</div>
      <div className="flex items-center gap-2">
        <ConditionCasesFilter onChange={value => handleFilterChange('mondo', value)} />
        <ClassificationSelectFilter
          value={filters.classification}
          onChange={value => handleFilterChange('classification', value)}
        />
        <InstitutionSelectFilter
          value={filters.institution}
          onChange={value => handleFilterChange('institution', value)}
        />
        <AnalysisSelectFilter value={filters.test} onChange={value => handleFilterChange('test', value)} />
      </div>
    </div>
  );
}

export default InterpretedCasesFilters;
