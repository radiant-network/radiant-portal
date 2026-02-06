import { v4 } from 'uuid';

import { SqonOpEnum } from '@/api/api';
import { Aggregation, AggregationConfig, FilterTypes } from '@/components/cores/applications-config';

import {
  BooleanOperators,
  IValueContent,
  IValueFacet,
  SET_ID_PREFIX,
  TSyntheticSqonContent,
  TSyntheticSqonContentValue,
} from '../type';

export const RangeOperators = {
  GreaterThan: SqonOpEnum.GreaterThan,
  LessThan: SqonOpEnum.LessThan,
  Between: SqonOpEnum.Between,
  GreaterThanOrEqualTo: SqonOpEnum.GreaterThanOrEqualTo,
  LessThanOrEqualTo: SqonOpEnum.LessThanOrEqualTo,
  In: SqonOpEnum.In,
} as const;

/**
 * Check if a sqon value is a set.
 */
export const isSet = (value: IValueFacet): boolean =>
  value.content.value && value.content.value.some(value => value?.toString().startsWith(SET_ID_PREFIX));

/**
 * Check if a query filter is a boolean one.
 */
export function isBooleanFacet(valueFacet: IValueFacet) {
  return valueFacet.content.value.every(val => ['false', 'true'].includes(val.toString().toLowerCase()));
}

/**
 * Check if a query filter is a range one.
 */
export function isRangeFacet(valueFacet: IValueFacet) {
  return valueFacet.op === RangeOperators.In ? false : valueFacet.op in RangeOperators;
}

/**
 * Check if content has field properties
 * - IValueFacet (with IValueContent)
 * - TSqonContentValue
 */
export function hasFieldProperty(value: TSyntheticSqonContentValue) {
  return typeof value === 'object' && value !== null && 'field' in value;
}

/**
 * Read aggregations config to return the associated aggregation
 */
export function getAggregationsByIValueFacet(aggregations: AggregationConfig, content: IValueFacet): Aggregation {
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

/**
 * Quickhand to create a new empty query
 */
export function createEmptyQuery() {
  return {
    content: [],
    id: v4(),
    op: BooleanOperators.And,
  };
}

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
