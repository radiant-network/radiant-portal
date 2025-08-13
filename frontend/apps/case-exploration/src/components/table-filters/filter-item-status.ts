import { Aggregation } from '@/api/api';
import { FileQuestion, CircleDashed, Pen, Hourglass, RefreshCcw, Check, OctagonX } from 'lucide-react';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

// Status icon mapping function
function getStatusIcon(statusKey: string) {
  const iconMap: { [key: string]: any } = {
    'draft': Pen,
    'submitted': Hourglass,
    'in_progress': RefreshCcw,
    'completed': Check,
    'incomplete': CircleDashed,
    'revoke': OctagonX,
    'unknown': FileQuestion,
  };
  return iconMap[statusKey.toLowerCase()] || FileQuestion;
}

export default function filterItemStatus(options: Aggregation[], t: any):  IFilterButtonItem[] {
  const translationKeyPrefix = 'caseExploration.status';

  return options.map(option => ({
    ...option,
    label: t(`${translationKeyPrefix}.${option.key}`, option.label || ''),
    icon: getStatusIcon(option.key || ''),
  }));
};