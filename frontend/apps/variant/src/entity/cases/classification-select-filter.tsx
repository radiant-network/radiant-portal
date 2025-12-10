import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { useI18n } from '@/components/hooks/i18n';

import { useCasesFilters } from './cases-filters-context';

interface ClassificationSelectFilterProps {
  value?: string;
  onChange?: (value: string) => void;
}

function ClassificationSelectFilter({ value = 'all', onChange }: ClassificationSelectFilterProps) {
  const { t } = useI18n();
  const { filters } = useCasesFilters();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full max-w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('variant.interpretation.classifications.all_classifications')}</SelectItem>
        {filters?.classification.map(classification => (
          <SelectItem key={classification.key} value={classification.key!}>
            {t(`variant.interpretation.classifications.${classification.label}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ClassificationSelectFilter;
