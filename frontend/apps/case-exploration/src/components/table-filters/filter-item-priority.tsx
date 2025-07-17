import { Aggregation } from '@/api/api';
import { IFilterButtonItem } from '@/components/base/buttons/filter-button';
import { Indicator, IndicatorVariant } from '@/components/base/ui/indicator';

function getPriorityColor(priorityKey: string): IndicatorVariant {
  const colorMap: { [key: string]: IndicatorVariant } = {
    'routine': 'grey',
    'urgent': 'blue',
    'stat': 'amber',
    'asap': 'red',
  };
  return colorMap[priorityKey.toLowerCase()] || 'grey';
}

export default function filterItemPriority(options: Aggregation[], t: any): IFilterButtonItem[] {
  const translationKeyPrefix = 'caseExploration.priority';
  
  // Define the desired order
  const priorityOrder = ['routine', 'urgent', 'stat', 'asap'];
  
  // Sort options according to the desired order
  const sortedOptions = options.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.key?.toLowerCase() || '');
    const bIndex = priorityOrder.indexOf(b.key?.toLowerCase() || '');
    
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

  return sortedOptions.map(option => {
    const color = getPriorityColor(option.key || '');
    const labelText = t(`${translationKeyPrefix}.${option.key}`, option.label || '');
    
    return {
      ...option,
      color,
      label: (
        <Indicator variant={color}>
          <span className="capitalize">{labelText}</span>
        </Indicator>
      ),
    };
  });
};