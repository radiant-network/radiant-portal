import type { FiltersValue } from '@/api/api';
import type { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * Item Status
 */
const itemStatusTranslationKeyPrefix = 'case_exploration.status';

export default function getItemStatus(options: FiltersValue[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${itemStatusTranslationKeyPrefix}.${option.key}`, option.label || ''),
  }));
}
