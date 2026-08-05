import type { FiltersValue } from '@/api/api';
import type { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * Relationship
 * Label are not translated
 */
export default function getRelationshipOptions(options: FiltersValue[]): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: option.label,
  }));
}
