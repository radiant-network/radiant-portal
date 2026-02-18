// import { SqonOpEnum } from "@/api/api";

import { SqonOpEnum } from '@/api/api';

export const RangeOperators = {
  GreaterThan: SqonOpEnum.GreaterThan,
  LessThan: SqonOpEnum.LessThan,
  Between: SqonOpEnum.Between,
  GreaterThanOrEqualTo: SqonOpEnum.GreaterThanOrEqualTo,
  LessThanOrEqualTo: SqonOpEnum.LessThanOrEqualTo,
  In: SqonOpEnum.In,
} as const;
export type RangeOperators = (typeof RangeOperators)[keyof typeof RangeOperators];

export const TermOperators = {
  In: SqonOpEnum.In,
  NotIn: SqonOpEnum.NotIn,
  All: SqonOpEnum.All,
  SomeNotIn: 'some-not-in', // Adding your new value
} as const;
export type TermOperators = (typeof TermOperators)[keyof typeof TermOperators];

export const BooleanOperators = {
  And: SqonOpEnum.And,
  Or: SqonOpEnum.Or,
  Not: SqonOpEnum.Not,
} as const;
export type BooleanOperators = (typeof BooleanOperators)[keyof typeof BooleanOperators];

export const FacetOperators = {
  Filter: 'filter', // This doesn't exist in SqonOpEnum
} as const;
export type FacetOperators = (typeof FacetOperators)[keyof typeof FacetOperators];

export const SET_ID_PREFIX = 'set_id:';

export type TFacetValue = Array<string | number | boolean>;

export interface IValueContent {
  field: string;
  value: TFacetValue;
  index?: string;
  overrideValuesName?: string;
  isUploadedList?: boolean;
  remoteComponent?: IRemoteComponent;
}

export interface IRemoteComponent {
  id: string;
  props?: {
    [value: string]: any;
  };
}

export type TValueOp = SqonOpEnum | (string & {});
export type TSqonGroupOp = BooleanOperators | (string & {});
export type TSqonContentValue = ISqonGroupFacet | IValueFacet;
export type TSqonContent = Array<TSqonContentValue>;

export interface IValueFacet {
  content: IValueContent;
  op: TValueOp | TermOperators;
  id?: string;
  title?: string;
}

export interface IValueQuery {
  content: TSyntheticSqonContent;
  op: TValueOp;
  id: any;
  name: string;
}

export interface IValueFacetQuery {
  filterID: any;
}

export interface ISqonGroupFacet {
  op: TSqonGroupOp;
  skipBooleanOperatorCheck?: boolean;
  content: TSqonContent;
}

export type TSyntheticSqonContentValue = ISqonGroupFacet | IValueFacet | IValueQuery | IValueFacetQuery | number;

export type TSyntheticSqonContent = Array<TSyntheticSqonContentValue>;

export interface ISyntheticSqon {
  op: TSqonGroupOp;
  content: TSyntheticSqonContent;
  id: string;
  title?: string;
}

/**
 * Strategy to use to merge the values of the field.
 */
export enum MERGE_VALUES_STRATEGIES {
  /**
   * Defaults to `OVERRIDE_VALUES`
   */
  DEFAULT = 'OVERRIDE_VALUES',
  /**
   * Replaces existing values with provided ones
   */
  OVERRIDE_VALUES = 'OVERRIDE_VALUES',
  /**
   * Append provided values to existing ones
   */
  APPEND_VALUES = 'APPEND_VALUES',
}

/**
 * Strategy to use to merge the operator of the field.
 */
export enum MERGE_OPERATOR_STRATEGIES {
  /**
   * Defaults to `OVERRIDE_OPERATOR`
   */
  DEFAULT = 'OVERRIDE_OPERATOR',
  /**
   * Replaces existing operator with provided one
   */
  OVERRIDE_OPERATOR = 'OVERRIDE_OPERATOR',
  /**
   * Keep the current operator.
   * The one provided will be used if the field is not found.
   */
  KEEP_OPERATOR = 'KEEP_OPERATOR',
}
