import { useI18n } from '@/components/hooks/i18n';
import CasesMondoAutocomplete from './cases-mondo-autocomplete';
import ClassificationSelectFilter from './classification-select-filter';
import InstitutionSelectFilter from './institution-select-filter';
import TestSelectFilter from './test-select-filter';

export interface InterpretedCasesFiltersState {
  mondo: string;
  institution: string;
  test: string;
  classification: string;
}

interface CasesFilterBarProps {
  filters: InterpretedCasesFiltersState;
  onFiltersChange: (filters: InterpretedCasesFiltersState) => void;
}

function InterpretedCasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <div className="text-sm">{t('variantEntity.cases.interpreted-table.filters.label')}</div>
      <div className="flex items-center gap-2">
        <CasesMondoAutocomplete
          onChange={value => onFiltersChange({ ...filters, mondo: value })}
          placeholder={t('variantEntity.cases.interpreted-table.filters.searchInputPlaceholder')}
        />
        <ClassificationSelectFilter />
        <InstitutionSelectFilter />
        <TestSelectFilter />
      </div>
    </div>
  );
}

export default InterpretedCasesFilters;
