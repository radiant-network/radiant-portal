import { createContext, Dispatch, useContext, useReducer } from 'react';
import { v4 } from 'uuid';

import { Count, CountBodyWithSqon, SortBody, Sqon, SqonContent, SqonOpEnum } from '@/api/api';
import { AggregationConfig } from '@/components/cores/applications-config';

import { createEmptyQuery, isEqualToField } from '../libs/sqon';
import { BooleanOperators, ISyntheticSqon, IValueContent, IValueFacet, TFacetValue } from '../type';

export enum QBActionType {
  REMOVE_QUERY = 'remove-query',
  SET_ACTIVE_QUERY = 'set-active-query',
  ADD_MULTISELECT_VALUE = 'update-active-query',
  REMOVE_MULTISELECT_PILL = 'remove-multiselect-pill',
  CHANGE_COMBINER_OPERATOR = 'change-combiner-operator',
}

export enum PillUserAction {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
  EMPTY = 'empty',
}

// @TODO: Should be on api side just like CountBodyWithSqon
export interface IListInput {
  listBody: {
    additional_fields?: string[];
    limit: number;
    page_index: number;
    sort: SortBody[];
    sqon: Sqon;
  };
}

export interface IHistory {
  uuid: string;
  type: PillUserAction;
  target: string;
}

export interface ICountInput {
  countBody: CountBodyWithSqon;
}

export interface IQBFetcher {
  list: (params: IListInput) => Promise<any[]>;
  count: (params: ICountInput) => Promise<Count>;
}

export interface IQBContext {
  aggregations: AggregationConfig;
  sqons: ISyntheticSqon[];
  activeQueryId: string;
  fetcher: IQBFetcher;
  history: IHistory;
}

type QBDispatch = Dispatch<ActionType>;

/**
 * Context
 */
export function getDefaultQBContext() {
  const uuid = v4();
  return {
    aggregations: {},
    activeQueryId: uuid,
    sqons: [
      {
        content: [],
        id: uuid,
        op: BooleanOperators.And,
      },
    ],
    fetcher: {
      list: (params: IListInput) => {
        console.error(`fetcher.list has not been set: ${params}`);
        return Promise.resolve([]);
      },
      count: (params: ICountInput) => {
        console.error(`fetcher.count has not been set: ${params}`);
        return Promise.resolve({ count: 0 });
      },
    },
    history: {
      type: PillUserAction.EMPTY,
      target: '',
      uuid: uuid,
    },
  };
}
export const QBContext = createContext<IQBContext>(getDefaultQBContext());
export const QBDispatchContext = createContext<QBDispatch>(() => {
  console.warn('QueryBuilderDispatchContext has been initialized without any dispatch props');
});

/**
 * Reducer
 *
 * Each payload is his own type
 */
type SetActiveQueryAction = {
  type: QBActionType.SET_ACTIVE_QUERY;
  payload: string;
};
type AddMultiselectAction = {
  type: QBActionType.ADD_MULTISELECT_VALUE;
  payload: IValueFacet;
};
type RemoveMultiselectAction = {
  type: QBActionType.REMOVE_MULTISELECT_PILL;
  payload: IValueFacet;
};

type RemoveQueryAction = {
  type: QBActionType.REMOVE_QUERY;
};

type ChangeCombinerOperatorAction = {
  type: QBActionType.CHANGE_COMBINER_OPERATOR;
  payload: BooleanOperators;
};

export type ActionType =
  | SetActiveQueryAction
  | RemoveQueryAction
  | AddMultiselectAction
  | RemoveMultiselectAction
  | ChangeCombinerOperatorAction
  | any;

export function qBReducer(context: IQBContext, action: ActionType) {
  switch (action.type) {
    /**
     * Set new active query
     * @TODO: To be updated when multi-queries are supported
     */
    case QBActionType.SET_ACTIVE_QUERY: {
      return {
        ...context,
        activeQueryId: action.payload,
      };
    }
    /**
     * Remove a query
     *
     * @TODO: should choose next query when mutli-query will be supported
     * @TODO: should clear active-query if active query is deleted
     */
    case QBActionType.REMOVE_QUERY: {
      const { activeQueryId } = context;
      const { sqons } = context;
      const index = sqons.findIndex(sqon => sqon.id === action.payload.id);
      sqons.splice(index, 1);

      return {
        ...context,
        sqons: [
          {
            content: [],
            op: BooleanOperators.And,
            id: activeQueryId,
          },
        ],
      };
    }
    /**
     * Add or update a query with a IValueFacet (MultiSelect)
     */
    case QBActionType.ADD_MULTISELECT_VALUE: {
      const { activeQueryId } = context;
      const { sqons } = context;
      const index = sqons.findIndex(sqon => sqon.id === activeQueryId);

      // active query is empty
      if (index < 0) {
        sqons.push({
          id: activeQueryId,
          content: [action.payload],
          op: BooleanOperators.And,
        });
        return { ...context, sqons: [...sqons], history: action.payload.content.field };
      }

      const field = action.payload.content.field;
      const fieldIndex = sqons[index].content.findIndex(c => isEqualToField(c, field));

      // add new field
      if (fieldIndex < 0) {
        sqons[index].content = [...sqons[index].content, action.payload];
        return { ...context, sqons: [...sqons], history: { uuid: v4(), type: PillUserAction.ADD, target: field } };
      }

      // add new values in field
      if (action.payload.content.value.length > 0) {
        sqons[index].content[fieldIndex] = action.payload;
        return {
          ...context,
          sqons: [...sqons],
          history: { uuid: v4(), type: PillUserAction.UPDATE, target: field },
        };
      }

      // value is empty, remove pills
      sqons[index].content.splice(fieldIndex, 1);
      return { ...context, sqons: [...sqons], history: { uuid: v4(), type: PillUserAction.UPDATE, target: field } };
    }
    /**
     * Remove multiselect value from active query
     */
    case QBActionType.REMOVE_MULTISELECT_PILL: {
      const { activeQueryId } = context;
      const { sqons } = context;
      const index = sqons.findIndex(sqon => sqon.id === activeQueryId);

      if (index < 0) {
        throw Error(
          `Cannot remove pill from an undefined active query: ${action.type} ${activeQueryId} ${action.payload}`,
        );
      }
      // remove pill
      const field = action.payload.content.field;
      const fieldIndex = sqons[index].content.findIndex(c => isEqualToField(c, field));
      sqons[index].content.splice(fieldIndex, 1);
      return {
        ...context,
        sqons: [...sqons],
        history: { uuid: v4(), type: PillUserAction.REMOVE, target: field },
      };
    }

    /**
     * Change combiner operator (toggle between and | or)
     */
    case QBActionType.CHANGE_COMBINER_OPERATOR: {
      const { activeQueryId } = context;
      const { sqons } = context;
      const index = sqons.findIndex(sqon => sqon.id === activeQueryId);

      if (index < 0) {
        throw Error(`ActiveQueryId does not exist in sqons: ${action.type} ${activeQueryId} ${action.payload}`);
      }

      sqons[index].op = action.payload.operator;
      return { ...context };
    }
    default: {
      throw Error(`Unknown action: ${action.type} ${JSON.stringify(action.payload)}`);
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
 * Return last user action on field
 */
export function useQBHistory() {
  const { history } = useQBContext();
  return history;
}
/**
 * Return the TFacetValue of IValueFacet for a specific field
 */
export function useQBMultiselectValue(field: string): TFacetValue {
  const activeQuery = useQBActiveQuery();
  if (activeQuery.content.length === 0) return [];

  const index = activeQuery.content.findIndex(
    (value: any) =>
      typeof value === 'object' &&
      value !== null &&
      'content' in value &&
      'field' in (value.content as IValueFacet) &&
      (value.content as IValueContent).field === field,
  );

  if (activeQuery.content[index]) {
    return (activeQuery.content[index] as IValueFacet).content.value;
  }

  return [];
}
