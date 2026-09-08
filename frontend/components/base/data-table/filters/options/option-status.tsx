import type { FiltersValue } from '@/api/api';
import { statusFallbackIcon, statusIcons } from '@/components/base/badges/status-badge';
import type { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * Item Status
 */
const itemStatusTranslationKeyPrefix = 'case_exploration.status';

function getItemStatusIcon(statusKey: string) {
  return statusIcons[statusKey.toLowerCase()] || statusFallbackIcon;
}

export default function getItemStatus(options: FiltersValue[], t: any): IFilterButtonItem[] {
  return options.map(option => ({
    ...option,
    label: t(`${itemStatusTranslationKeyPrefix}.${option.key}`, option.label || ''),
    icon: getItemStatusIcon(option.key || ''),
  }));
}
