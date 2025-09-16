import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * Data type
 */
const dataTypeTranslationKeyPrefix = 'common.data_type_code';
export default function getDataTypeOptions(options: Aggregation[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${dataTypeTranslationKeyPrefix}.${option.key}`, option.label || ''),
  }));
}
