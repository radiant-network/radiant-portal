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
