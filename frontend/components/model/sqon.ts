// import { SqonOpEnum } from "@/api/api";
import { SqonOpEnum } from "../../api/api";

export const RangeOperators = {
  GreaterThan: SqonOpEnum.GreaterThan,
  LessThan: SqonOpEnum.LessThan,
  Between: SqonOpEnum.Between,
  GreaterThanOrEqualTo: SqonOpEnum.GreaterThanOrEqualTo,
  LessThanOrEqualTo: SqonOpEnum.LessThanOrEqualTo,
  In: SqonOpEnum.In,
} as const;
export type RangeOperators =
  (typeof RangeOperators)[keyof typeof RangeOperators];

export const TermOperators = {
  In: SqonOpEnum.In,
  NotIn: SqonOpEnum.NotIn,
  All: SqonOpEnum.All,
  SomeNotIn: "some-not-in", // Adding your new value
} as const;
export type TermOperators = (typeof TermOperators)[keyof typeof TermOperators];

export const BooleanOperators = {
  And: SqonOpEnum.And,
  Or: SqonOpEnum.Or,
  Not: SqonOpEnum.Not,
} as const;
export type BooleanOperators =
  (typeof BooleanOperators)[keyof typeof BooleanOperators];

export const FilterOperators = {
  Filter: "filter", // This doesn't exist in SqonOpEnum
} as const;
export type FilterOperators =
  (typeof FilterOperators)[keyof typeof FilterOperators];

export const SET_ID_PREFIX = "set_id:";

export type TFilterValue = Array<string | number | boolean>;

export interface IValueContent {
  field: string;
  value: TFilterValue;
  index?: string;
  overrideValuesName?: string;
  isUploadedList?: boolean;
  remoteComponent?: IRemoteComponent;
}
export interface IWildCardValueContent extends Omit<IValueContent, "field"> {
  fields: string[];
}

export interface IRemoteComponent {
  id: string;
  props?: {
    [value: string]: any;
  };
}

export type TValueOp = SqonOpEnum | (string & {});
export type TSqonGroupOp = BooleanOperators | (string & {});
export type TSqonContentValue = ISqonGroupFilter | IValueFilter;
export type TSqonContent = Array<TSqonContentValue>;

export interface IValueFilter {
  content: IValueContent;
  op: TValueOp;
  id?: string;
  title?: string;
}

export interface IValueQuery {
  content: TSyntheticSqonContent;
  op: TValueOp;
  id: string;
  title: string;
}

export interface IValueFilterQuery {
  filterID: string;
}

export interface IWildCardValueFilter extends Omit<IValueFilter, "content"> {
  content: IWildCardValueContent;
}

export interface ISqonGroupFilter {
  op: TSqonGroupOp;
  skipBooleanOperatorCheck?: boolean;
  content: TSqonContent;
}

export type TSyntheticSqonContentValue =
  | ISqonGroupFilter
  | IValueFilter
  | IValueQuery
  | IValueFilterQuery
  | IWildCardValueFilter
  | number;

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
  DEFAULT = "OVERRIDE_VALUES",
  /**
   * Replaces existing values with provided ones
   */
  OVERRIDE_VALUES = "OVERRIDE_VALUES",
  /**
   * Append provided values to existing ones
   */
  APPEND_VALUES = "APPEND_VALUES",
}

/**
 * Strategy to use to merge the operator of the field.
 */
export enum MERGE_OPERATOR_STRATEGIES {
  /**
   * Defaults to `OVERRIDE_OPERATOR`
   */
  DEFAULT = "OVERRIDE_OPERATOR",
  /**
   * Replaces existing operator with provided one
   */
  OVERRIDE_OPERATOR = "OVERRIDE_OPERATOR",
  /**
   * Keep the current operator.
   * The one provided will be used if the field is not found.
   */
  KEEP_OPERATOR = "KEEP_OPERATOR",
}

export interface IMergeOptions {
  values: MERGE_VALUES_STRATEGIES;
  operator: MERGE_OPERATOR_STRATEGIES;
}

export type ResolveSyntheticSqonFunc = (
  syntheticSqon: ISyntheticSqon | TSyntheticSqonContentValue,
  sqonsList: ISyntheticSqon[]
) => ISqonGroupFilter;
