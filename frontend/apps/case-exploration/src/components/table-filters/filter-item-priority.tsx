import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';
import PriorityIndicator, { PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';

// Define the desired order
const ORDER = ['routine', 'urgent', 'asap', 'stat'];

export default function filterItemPriority(options: Aggregation[]): IFilterButtonItem[] {
  // Sort options according to the desired order
  const sortedOptions = options.sort((a, b) => {
    const aIndex = ORDER.indexOf(a.key?.toLowerCase() || '');
    const bIndex = ORDER.indexOf(b.key?.toLowerCase() || '');

    // If both items are in the priority order, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // If only one item is in the priority order, it comes first
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // If neither item is in the priority order, maintain original order
    return 0;
  });

  return sortedOptions.map(option => ({
    ...option,
    label: <PriorityIndicator code={option.key as PriorityIndicatorCode} />,
  }));
}
