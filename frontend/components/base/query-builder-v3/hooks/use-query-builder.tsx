import { createContext, Dispatch, useContext, useReducer } from 'react';
import { v4 } from 'uuid';

import { SqonContent, SqonOpEnum } from '@/api/api';
import { AggregationConfig } from '@/components/cores/applications-config';

import { createEmptyQuery, hasFieldProperty } from '../libs/facet-libs';
import { BooleanOperators, ISyntheticSqon, IValueContent, IValueFacet } from '../type';

export enum QBActionFlag {
  INITIALIZE = 'initialize',
  SET_ACTIVE_QUERY = 'set-active-query',
  ADD_IVALUEFACET = 'update-active-query',
}

export interface IQBContext {
  aggregations: AggregationConfig;
  sqons: ISyntheticSqon[];
  activeQueryId: string;
}

type QBDispatch = Dispatch<QBAction>;

/**
 * Context
 */
export const DEFAULT_QBCONTEXT = {
  aggregations: {},
  activeQueryId: v4(),
  sqons: [],
};
export const QBContext = createContext<IQBContext>(DEFAULT_QBCONTEXT);
export const QBDispatchContext = createContext<QBDispatch>(() => {
  console.warn('QueryBuilderDispatchContext has been initialized without any dispatch props');
});

/**
 * Reducer
 *
 * Each payload is his own type
 */
type QBSetQueryAction = {
  type: QBActionFlag.SET_ACTIVE_QUERY;
  payload: string;
};
type QBUpdateQueryAction = {
  type: QBActionFlag.ADD_IVALUEFACET;
  payload: IValueFacet;
};
export type QBAction = QBSetQueryAction | QBUpdateQueryAction | any;

export function qBReducer(context: IQBContext, action: QBAction) {
  switch (action.type) {
    case QBActionFlag.SET_ACTIVE_QUERY: {
      return {
        ...context,
        activeQuery: action.payload,
      };
    }
    /**
     * Add or update a query with a IValueFacet
     */
    case QBActionFlag.ADD_IVALUEFACET: {
      const { activeQueryId } = context;
      const { sqons } = context;
      const index = context.sqons.findIndex(sqon => sqon.id === activeQueryId);
      // active query is empty
      if (index < 0) {
        sqons.push({
          id: activeQueryId,
          content: [action.payload],
          op: BooleanOperators.And,
        });
      } else {
        const fieldIndex = sqons[index].content.findIndex(c => hasFieldProperty(c) && c.field === action.payload.field);
        if (fieldIndex < 0) {
          // add new field
          sqons[index].content = [...sqons[index].content, action.payload];
        } else {
          // update existing field
          sqons[index].content[fieldIndex] = action.payload;
        }
      }

      return { context, sqons: [...sqons] };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

/**
 * Provider
 */
type QBProviderProps = IQBContext & {
  children: React.ReactElement;
};
export function QBProvider({ children, ...props }: QBProviderProps) {
  const [value, dispatch] = useReducer(qBReducer, props);

  return (
    <QBContext value={value}>
      <QBDispatchContext value={dispatch}>{children}</QBDispatchContext>
    </QBContext>
  );
}

/**
 * Custom Hooks
 */
export function useQBContext() {
  return useContext(QBContext);
}

export function useQBDispatch() {
  return useContext(QBDispatchContext);
}

/**
 * Retrieve active query
 */
export function useQBActiveQuery() {
  const { activeQueryId, sqons } = useQBContext();
  return sqons.find(sqon => sqon.id === activeQueryId) ?? createEmptyQuery();
}

/**
 * Return active query sqon
 * The format is converted to be use by the api
 */
export function useQBActiveSqon() {
  const activeQuery = useQBActiveQuery();
  return {
    content: activeQuery.content as SqonContent,
    op: activeQuery.op as SqonOpEnum,
  };
}

/**
 * Return the IValueFacet's value for a specific multi-select from the active query
 */
export function useQBMultislectValue(field: string) {
  const activeQuery = useQBActiveQuery();
  const index = activeQuery.content.findIndex(
    (value: any) =>
      typeof value === 'object' &&
      value !== null &&
      'content' in value &&
      'field' in (value.content as IValueFacet) &&
      (value.content as IValueContent).field === field,
  );
  return (activeQuery.content[index] as IValueFacet).content.value ?? [];
}
