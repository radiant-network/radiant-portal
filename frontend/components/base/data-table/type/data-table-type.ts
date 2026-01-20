import { ColumnOrderState, ColumnPinningState, ColumnSizingState } from '@tanstack/react-table';

import { ColumnVisiblity } from '../data-table';

export type TableObserverProps = {
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  columnSizing: ColumnSizingState;
  columnVisibility: ColumnVisiblity;
  columns: TableObserverColumn[];
  pagination?: {
    pageSize: number;
  };
};

export type TableObserverColumn = {
  id: string;
  minSize?: number;
  maxSize?: number;
};

export const DEFAULT_TABLE_OBSERVER: TableObserverProps = {
  columnOrder: [],
  columnPinning: {},
  columnSizing: {},
  columnVisibility: {},
  columns: [],
};
