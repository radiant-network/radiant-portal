import { AutoComplete } from '@/components/base/data-entry/auto-complete';
import { Label } from '@/components/base/ui/label';
import { useI18n } from '@/components/hooks/i18n';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';

type AutoSuggestProps = {
  field: AggregationConfig;
};
function AutoSuggest({ field }: AutoSuggestProps) {
  const { t } = useI18n();

  return (
    <div>
      <Label className="text-xs">{t(`common.filters.labels.${field.translation_key}`)}</Label>
      <AutoComplete size="xxs" />
    </div>
  );
}
export default AutoSuggest;
