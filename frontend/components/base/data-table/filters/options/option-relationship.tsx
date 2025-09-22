import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * Relationship
 * Label are not translated
 */
export default function getRelationshipOptions(options: Aggregation[]): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: option.label,
  }));
}
