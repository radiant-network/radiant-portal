import { Aggregation, AggregationConfig, FilterTypes } from '@/components/cores/applications-config';

import { RangeOperators } from '../type';

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
 * Read aggregations config to return the associated aggregation, or undefined when
 * the field has no configured facet.
 */
export function findAggregationByField(aggregations: AggregationConfig, field: string): Aggregation | undefined {
  for (const key in aggregations) {
    const result = aggregations[key].items.find(item => item.key === field);
    if (result) return result;
  }

  return undefined;
}

/**
 * Read aggregations config to return the associated aggregation
 */
export function getAggregationByField(aggregations: AggregationConfig, field: string): Aggregation {
  const result = findAggregationByField(aggregations, field);
  if (result) return result;

  console.error(`${field} doesn't exist in aggregations`, aggregations);
  return {
    type: FilterTypes.MULTIPLE,
    key: 'error',
    translation_key: 'error',
  };
}

/**
 * Check if a value from config is a valid range operator
 */
export function isValidRangeOperator(value: any): value is RangeOperators {
  return Object.values(RangeOperators).includes(value);
}
