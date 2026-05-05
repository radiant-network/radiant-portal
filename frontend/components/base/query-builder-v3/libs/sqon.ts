import { v4 } from 'uuid';

import {
  BooleanOperators,
  ISqonGroupFacet,
  ISyntheticSqon,
  IValueFacet,
  RangeOperators,
  SET_ID_PREFIX,
  TSyntheticSqonContentValue,
} from '@/components/base/query-builder-v3/type';
import { AggregationConfig, FilterTypes } from '@/components/cores/applications-config';

export const isSet = (value: IValueFacet): boolean =>
  value.content.value && value.content.value.some(value => value?.toString().startsWith(SET_ID_PREFIX));

/**
 * Check if sqon is a ISqonGroupFacet
 * Generaly use to detect a combinaison of multiple queries
 */
export function isCombinedQuery(sqon: ISqonGroupFacet): boolean {
  return Array.isArray(sqon.content);
}

/**
 * For boolean facet
 * Check if sqon is boolean
 */
export function isBoolean(sqon: IValueFacet): boolean {
  return sqon.content.value.every(val => ['false', 'true'].includes(val.toString().toLowerCase()));
}

/**
 * For numerical facet
 * Is in-between (or range)
 */
export function isRange(valueFacet: IValueFacet): boolean {
  return valueFacet.op === RangeOperators.In ? false : valueFacet.op in RangeOperators;
}

/**
 * For search facet
 * Check if a field name corresponds to a search field in aggregations
 */
export function isSearchField(valueFacet: IValueFacet, aggregations: AggregationConfig): boolean {
  const field = valueFacet.content.field;
  const searchKey = `${FilterTypes.SEARCH_BY}_${field}`;

  // Search in all aggregation groups and items
  const allAggregations = Object.values(aggregations).flatMap(group => group.items);
  return allAggregations.some(agg => agg.key === searchKey && agg.type === FilterTypes.SEARCH_BY);
}

/**
 * Check content type and valid if field is equal to given value
 * - IValueFacet (with IValueContent)
 * - TSqonContentValue
 */
export function isEqualToField(sqon: TSyntheticSqonContentValue, field: string): boolean {
  if (typeof sqon === 'object' && sqon !== null && 'content' in sqon) {
    const content = (sqon as IValueFacet).content;
    if ('field' in content) {
      return content.field === field;
    }
  }
  return false;
}

/**
 * Shorthand to create a new empty query
 */
export function createEmptyQuery() {
  return {
    content: [],
    op: BooleanOperators.And,
    id: v4(),
  };
}

/**
 * Check if current active query is empty
 */
export function isSqonEmpty(sqon: ISyntheticSqon): boolean {
  return sqon.content.length === 0;
}

/**
 * Check if sqons contains only an empty sqon
 */
export function isQueryEmpty(sqons: ISyntheticSqon[]): boolean {
  if (sqons.length === 1) {
    return isSqonEmpty(sqons[0]);
  }

  return false;
}

/**
 * Check if there's already an empty query
 */
export function hasEmptyQuery(sqons: ISyntheticSqon[]): boolean {
  return sqons.some(sqon => sqon.content.length === 0);
}

/**
 * Deep comparison function that recursively compares objects and arrays
 */
export function deepSqonsEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return obj1 === obj2;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;

    // For arrays, check if every element in obj1 has a match in obj2 (ignoring order)
    return (
      obj1.every((item1: any) => obj2.some((item2: any) => deepSqonsEqual(item1, item2))) &&
      obj2.every((item2: any) => obj1.some((item1: any) => deepSqonsEqual(item1, item2)))
    );
  }

  // For objects, compare all keys recursively
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key: string) => keys2.includes(key) && deepSqonsEqual(obj1[key], obj2[key]));
}
