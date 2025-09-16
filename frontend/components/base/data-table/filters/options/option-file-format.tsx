import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

const translationKeyPrefix = 'common.file_format';

export default function getFileFormatOptions(options: Aggregation[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${translationKeyPrefix}.${option.key}`, option.label || ''),
  }));
}
