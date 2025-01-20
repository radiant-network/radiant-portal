import { ReactNode } from "react";

import { RangeOperators, TermOperators } from "../../utils/sqon/operators";

export type onChangeType<IFilterType extends TFilterData = any> = (
  fg: IFilterGroup,
  f: IFilter<IFilterType>[]
) => void;
export type onIsOpenChange = (isOpen: boolean) => void;
export type onSearchVisibleChange = (isVisible: boolean) => void;

export interface IFilterRangeTypes {
  key: string;
  name: string | React.ReactNode;
}

export interface IFilterRange {
  max: number | undefined;
  min: number | undefined;
  noDataSelected?: boolean;
  operator: RangeOperators;
  rangeType?: string | undefined;
}

export interface IFilterText {
  text: string;
}

export interface IRangeOperatorConfig {
  value: RangeOperators;
  label: ReactNode;
  disableMin?: boolean;
  disableMax?: boolean;
}

export interface IFilterCheckboxConfig {
  nameMapping?: {
    [field: string]: string;
  };
  showMoreReadOnly?: boolean;
  showSelectAll?: boolean;
  withFooter?: boolean;
  extraFilterDictionary?: string[];
  facetTranslate?: (value: string) => string;
}

export interface IFilterRangeConfig {
  max: number | undefined;
  min: number | undefined;
  step?: number | string;
  operators?: IRangeOperatorConfig[];
  rangeTypes?: IFilterRangeTypes[];
  defaultOperator?: RangeOperators;
  defaultMin?: number;
  defaultMax?: number;
  noDataInputOption?: boolean;
  intervalDecimal?: number;
}

export interface IFilterTextInputConfig {
  label: ReactNode;
  placeholder: string;
  tooltip?: {
    text: ReactNode;
  };
  validateInput?: (text: string) => boolean;
}

export type TFilterGroupConfig =
  | IFilterRangeConfig
  | IFilterTextInputConfig
  | IFilterCheckboxConfig;

export interface IFilterGroupDefaultsRange {
  min: number;
  max: number;
  operator: string;
}

export type TFilterGroupDefaults = IFilterGroupDefaultsRange;

export interface IFilterGroup<T extends TFilterGroupConfig = any> {
  field: string;
  config?: T;
  defaults?: TFilterGroupDefaults;
  title: ReactNode;
  type: VisualType;
  headerTooltip?: string;
  noDataInputOption?: boolean;
}

export interface IFilterCount {
  count: number;
  key: string;
  operator?: TermOperators;
}

export type TFilterData = IFilterCount | IFilterRange | IFilterText;

export interface IFilter<T extends TFilterData = any> {
  data: T;
  name: ReactNode;
  id: string; //  dash (-) separated key
}

export enum VisualType {
  Checkbox = "checkbox",
  Toggle = "toggle",
  Range = "range",
  Text = "text",
  OntologyTree = "nested",
}

export interface IDictionary {
  actions?: IActions;
  messages?: IMessages;
  checkBox?: ICheckBox;
  range?: IRange;
  operators?: IOperators;
  quickFilter?: IQuickFilter;
}

export type IFacetDictionary = {
  [key: string]: any;
};

export interface IActions {
  all: ReactNode;
  apply: ReactNode;
  clear: ReactNode;
  less: ReactNode;
  more: ReactNode;
  none: ReactNode;
  dictionary: ReactNode;
}

export interface ICheckBox {
  searchPlaceholder: ReactNode;
  noData: ReactNode;
}

export interface IMessages {
  errorNoData: ReactNode;
}

export interface IRange {
  max: ReactNode;
  min: ReactNode;
  unit?: ReactNode;
  is?: ReactNode;
  noData: ReactNode;
  from: ReactNode;
  to: ReactNode;
  actualInterval: ReactNode;
}

export interface IOperators {
  between?: ReactNode;
  lessThan?: ReactNode;
  lessThanOfEqual?: ReactNode;
  greaterThan?: ReactNode;
  greaterThanOrEqual?: ReactNode;
  allOf?: ReactNode;
  anyOf?: ReactNode;
  noneOf?: ReactNode;
}

export interface IQuickFilter {
  emptyMessage?: ReactNode;
  menuTitle?: ReactNode;
  placeholder?: string;
  results?: ReactNode;
}

export type TExtendedMapping = {
  active: boolean;
  displayName: string;
  isArray: boolean;
  type: string;
  field: string;
  rangeStep?: number;
};

export type IRangeAggs = {
  stats: {
    max: number;
    min: number;
  };
};
