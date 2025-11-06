import { AggregationConfig } from '@/components/model/applications-config';

export function getVisibleAggregations(aggregationGroups: AggregationConfig) {
  return Object.fromEntries(
    Object.entries(aggregationGroups)
      .map(([key, group]) => {
        const filteredGroup = {
          ...group,
          items: group.items.filter(item => item.facetHidden !== true),
        };
        return [key, filteredGroup];
      })
      .filter(([_, group]) => (group as any).items.length > 0), // Remove groups with no visible items
  ) as AggregationConfig;
}
