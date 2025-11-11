import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { useI18n } from '@/components/hooks/i18n';

import { useCasesFilters } from './cases-filters-context';

interface InstitutionSelectFilterProps {
  value?: string;
  onChange?: (value: string) => void;
}

function InstitutionSelectFilter({ value = 'all', onChange }: InstitutionSelectFilterProps) {
  const { t } = useI18n();
  const { filters } = useCasesFilters();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full max-w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('variant_entity.cases.common_filters.institutions.all_institutions')}</SelectItem>
        {filters?.diagnosis_lab.map(lab => (
          <SelectItem key={lab.key} value={lab.key!}>
            {lab.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default InstitutionSelectFilter;
