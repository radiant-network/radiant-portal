import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
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
        <SelectItem value="all">{t('variantEntity.cases.commonFilters.classifications.allClassifications')}</SelectItem>
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
