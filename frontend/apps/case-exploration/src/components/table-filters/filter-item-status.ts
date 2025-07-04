import { Aggregation } from '@/api/api';
import { FileQuestion, CircleDashed, Pen, Hourglass, RefreshCcw, Check, OctagonX, ListFilter, X } from 'lucide-react';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';

// Status icon mapping function
function getStatusIcon(statusKey: string) {
  const iconMap: { [key: string]: any } = {
    'draft': Pen,
    'on-hold': Hourglass, // on-hold key == . submitted
    'active': RefreshCcw, // active key == . in_progress
    'completed': Check,
    'incomplete': CircleDashed,
    'revoke': OctagonX,
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