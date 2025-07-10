import { useI18n } from '@/components/hooks/i18n';
import CasesMondoAutocomplete from './cases-mondo-autocomplete';
import InstitutionSelectFilter from './institution-select-filter';
import TestSelectFilter from './test-select-filter';

export interface UninterpretedCasesFiltersState {
  institution: string;
  test: string;
}

interface CasesFilterBarProps {
  filters: UninterpretedCasesFiltersState;
  onFiltersChange: (filters: UninterpretedCasesFiltersState) => void;
}

function OtherCasesFilters({ filters, onFiltersChange }: CasesFilterBarProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <div className="text-sm">{t('variantEntity.cases.other-table.filters.label')}</div>
      <div className="flex items-center gap-2">
        <CasesMondoAutocomplete
          onChange={console.log}
          placeholder={t('variantEntity.cases.other-table.filters.searchInputPlaceholder')}
        />
        <InstitutionSelectFilter />
        <TestSelectFilter />
      </div>
    </div>
  );
}

export default OtherCasesFilters;
