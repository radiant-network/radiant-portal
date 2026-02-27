import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

const zygosityTranslationKeyPrefix = 'common.filters.values.zygosity';

export default function getItemZygosity(options: Aggregation[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${zygosityTranslationKeyPrefix}.${option.key?.toLowerCase()}`) || option.key,
  }));
}
