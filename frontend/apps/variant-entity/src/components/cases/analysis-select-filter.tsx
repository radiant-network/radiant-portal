import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { useI18n } from '@/components/hooks/i18n';

import { useCasesFilters } from './cases-filters-context';

interface AnalysisSelectFilterProps {
  value?: string;
  onChange?: (value: string) => void;
}

function AnalysisSelectFilter({ value = 'all', onChange }: AnalysisSelectFilterProps) {
  const { t } = useI18n();
  const { filters } = useCasesFilters();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full max-w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('variant_entity.cases.common_filters.tests.all_tests')}</SelectItem>
        {filters?.case_analysis.map(analysis => (
          <SelectItem key={analysis.key} value={analysis.key!}>
            {analysis.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AnalysisSelectFilter;
