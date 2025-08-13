import { Check, CircleDashed, FileQuestion, Hourglass, OctagonX, Pen, RefreshCcw } from 'lucide-react';

import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

// Status icon mapping function
function getStatusIcon(statusKey: string) {
  const iconMap: { [key: string]: any } = {
    draft: Pen,
    'on-hold': Hourglass, // on-hold key == . submitted
    active: RefreshCcw, // active key == . in_progress
    completed: Check,
    incomplete: CircleDashed,
    revoke: OctagonX,
  };
  return iconMap[statusKey.toLowerCase()] || FileQuestion;
}

export default function filterItemStatus(options: Aggregation[], t: any): IFilterButtonItem[] {
  const translationKeyPrefix = 'case_exploration.status';

  return options.map(option => ({
    ...option,
    label: t(`${translationKeyPrefix}.${option.key}`, option.label || ''),
    icon: getStatusIcon(option.key || ''),
  }));
}
