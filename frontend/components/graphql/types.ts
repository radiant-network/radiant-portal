import { TExtendedMapping } from "../composite/Filters/types";
import { ISyntheticSqon } from "../utils/sqon/types";

import { SortDirection } from "./constants";

export interface IArrangerNodeData {
  id: string;
  cid?: string;
  key?: string;
}

export type TAggregationBuckets = {
  buckets: [
    {
      key: string;
      key_as_string?: string;
      doc_count: number;
    }
  ];
  stats: string;
};

export type TRawAggregation = {
  data: {
    [key: string]: {
      aggregations: TAggregations;
    };
  };
};

export type TAggregations = Record<string, TAggregationBuckets>;

export interface IGqlResults<DataT> {
  data: DataT[];
  aggregations: TAggregations;
  loading: boolean;
  total: number;
}

// Recursive type that can represent nested query
export interface IArrangerResultsTree<T extends IArrangerNodeData> {
  hits: IArrangerHits<T>;
}

export interface IArrangerHits<T extends IArrangerNodeData> {
  total?: number;
  edges: IArrangerEdge<T>[];
}

export type IArrangerEdge<T extends IArrangerNodeData> = {
  node: T;
  searchAfter?: any[];
};

export interface IExtendedMappingResults {
  loading: boolean;
  data: TExtendedMapping[];
}

export interface ISearchAfter {
  head?: any[];
  tail?: any[];
}

export interface IQueryResults<T> {
  data: T;
  loading: boolean;
  total: number;
  searchAfter?: ISearchAfter;
}

export type IQueryVariable = {
  sqon?: ISyntheticSqon;
  first?: number;
  offset?: number;
  sort?: ISort[];
  pageSize?: number;
  searchAfter?: any[];
};

export interface ISort {
  field: string;
  order: SortDirection;
}

export interface IQueryOperationsConfig {
  previous?: boolean;
  next?: boolean;
}

export interface IQueryConfig {
  pageIndex: number;
  size: number;
  sort: ISort[];
  searchAfter?: any[];
  firstPageFlag?: any[];
  operations?: IQueryOperationsConfig;
}

export type TPagingConfig = {
  index: number;
  size: number;
};

export type TQueryConfigCb = (config: IQueryConfig) => void;
