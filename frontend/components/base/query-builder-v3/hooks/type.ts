import { IRemoteComponent, MERGE_VALUES_STRATEGIES, RangeOperators, TermOperators } from '@/components/cores/sqon';

export enum QBActionFlag {
  UPDATE_ACTIVE_QUERY = 'update-active-query',
}

export type QueryProps = {};

export type ActiveQueryProps = {
  field: string;
  value: Array<string | number | boolean>;
  merge_strategy?: MERGE_VALUES_STRATEGIES;
  operator?: TermOperators | RangeOperators;
  index?: string;
  overrideValuesName?: string;
  isUploadedList?: boolean;
  remoteComponent?: IRemoteComponent;
};
