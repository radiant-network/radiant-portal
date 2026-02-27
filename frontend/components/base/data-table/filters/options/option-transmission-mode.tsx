import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

const transmissionModeTranslationKeyPrefix = 'common.filters.values.transmission_mode';

export default function getItemTransmissionMode(options: Aggregation[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${transmissionModeTranslationKeyPrefix}.${option.key?.toLowerCase()}`) || option.key,
  }));
}
