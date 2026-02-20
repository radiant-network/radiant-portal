import { IValueFacet } from '@/components/base/query-builder-v3/type';
import { Aggregation, AggregationConfig, FilterTypes } from '@/components/cores/applications-config';

/**
 * Return visible facets
 */
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

/**
 * Read aggregations config to return the associated aggregation
 */
export function getMultiselectAggregation(aggregations: AggregationConfig, content: IValueFacet): Aggregation {
  const target = content.content.field;
  let result;
  for (const key in aggregations) {
    result = aggregations[key].items.find(item => item.key === target);
    if (result) return result;
  }

  console.error(`${target} doesn't exist in aggregations`, aggregations);
  return {
    type: FilterTypes.MULTIPLE,
    key: 'error',
    translation_key: 'error',
  };
}
