import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { useI18n } from '@/components/hooks/i18n';

function ClassificationSelectFilter() {
  const { t } = useI18n();

  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-full max-w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('variantEntity.cases.commonFilters.classifications.allClassifications')}</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default ClassificationSelectFilter;
