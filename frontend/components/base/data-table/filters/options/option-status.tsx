import { Check, CircleDashed, FileQuestion, Hourglass, OctagonX, Pen, RefreshCcw } from 'lucide-react';

import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * Item Status
 */
const itemStatusTranslationKeyPrefix = 'case_exploration.status';
function getItemStatusIcon(statusKey: string) {
  const iconMap: { [key: string]: any } = {
    draft: Pen,
    submitted: Hourglass,
    in_progress: RefreshCcw,
    completed: Check,
    incomplete: CircleDashed,
    revoke: OctagonX,
    unknown: FileQuestion,
  };
  return iconMap[statusKey.toLowerCase()] || FileQuestion;
}

export default function getItemStatus(options: Aggregation[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${itemStatusTranslationKeyPrefix}.${option.key}`, option.label || ''),
    icon: getItemStatusIcon(option.key || ''),
  }));
}
