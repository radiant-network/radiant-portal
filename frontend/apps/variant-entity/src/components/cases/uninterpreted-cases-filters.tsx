import { useI18n } from '@/components/hooks/i18n';
import InstitutionSelectFilter from './institution-select-filter';
import AnalysisSelectFilter from './analysis-select-filter';
import PhenotypeCasesFilter from './phenotype-cases-filter';

export interface UninterpretedCasesFiltersState {
  phenotype: string;
  institution: 'all' | string;
  test: 'all' | string;
}

interface CasesFilterBarProps {
  filters: UninterpretedCasesFiltersState;
  onFiltersChange: (filters: UninterpretedCasesFiltersState) => void;
}

function OtherCasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();

  const handleFilterChange = (field: keyof UninterpretedCasesFiltersState, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="space-y-2">
      <div className="text-sm">{t('variantEntity.cases.other-table.filters.label')}</div>
      <div className="flex items-center gap-2">
        <PhenotypeCasesFilter onChange={value => handleFilterChange('phenotype', value)} />
        <InstitutionSelectFilter
          value={filters.institution}
          onChange={value => handleFilterChange('institution', value)}
        />
        <AnalysisSelectFilter value={filters.test} onChange={value => handleFilterChange('test', value)} />
      </div>
    </div>
  );
}

export default OtherCasesFilters;
