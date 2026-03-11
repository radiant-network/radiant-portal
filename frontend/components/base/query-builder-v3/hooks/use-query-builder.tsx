import { createContext, Dispatch, useContext, useReducer } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { v4 } from 'uuid';

import { Count, CountBodyWithSqon, SortBody, Sqon, SqonContent, SqonOpEnum } from '@/api/api';
import { AggregationConfig, IFilterRangeConfig } from '@/components/cores/applications-config';

import { createEmptyQuery, isEqualToField } from '../libs/sqon';
import { BooleanOperators, ISyntheticSqon, IValueContent, IValueFacet, TFacetValue } from '../type';

export const DEFAULT_EMPTY_QUERY = {
  content: [],
  op: 'and',
};

export enum QBActionType {
  ADD_QUERY = 'add-query',
  REMOVE_QUERY = 'remove-query',
  DUPLICATE_QUERY = 'duplicate-query',
  SET_ACTIVE_QUERY = 'set-active-query',
  ADD_OR_UPDATE_FACET_PILL = 'add-or-update-facet-pill',
  REMOVE_FACET_PILL = 'remove-facet-pill',
  CHANGE_COMBINER_OPERATOR = 'change-combiner-operator',
  SET_LABELS_ENABLED = 'set-labels-enabled',
  REMOVE_ALL_QUERIES = 'remove-all-queries-all',
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

export interface ISettings {
  labelsEnabled: boolean;
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
  settings: ISettings;
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
    settings: {
      labelsEnabled: true,
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
// Query
type AddQueryAction = {
  type: QBActionType.ADD_QUERY;
};
type RemoveQueryAction = {
  type: QBActionType.REMOVE_QUERY;
};
type DuplicateQueryAction = {
  type: QBActionType.DUPLICATE_QUERY;
  payload: IValueFacet;
};
type SetActiveQueryAction = {
  type: QBActionType.SET_ACTIVE_QUERY;
  payload: {
    id: string;
  };
};
type ChangeCombinerOperatorAction = {
  type: QBActionType.CHANGE_COMBINER_OPERATOR;
  payload: BooleanOperators;
};
// Facet/Pills
type AddOrUpdateFacetAction = {
  type: QBActionType.ADD_OR_UPDATE_FACET_PILL;
  payload: IValueFacet;
};
type RemoveFacetPillAction = {
  type: QBActionType.REMOVE_FACET_PILL;
  payload: IValueFacet;
};
// Settings
type SetLabelsEnabledAction = {
  type: QBActionType.SET_LABELS_ENABLED;
  payload: {
    labelsEnabled: boolean;
  };
};
type RemoveAllQueriesAction = {
  type: QBActionType.REMOVE_ALL_QUERIES;
};

export type ActionType =
  | AddQueryAction
  | SetActiveQueryAction
  | DuplicateQueryAction
  | RemoveQueryAction
  | AddOrUpdateFacetAction
  | RemoveFacetPillAction
  | ChangeCombinerOperatorAction
  | SetLabelsEnabledAction
  | RemoveAllQueriesAction
  | any;

export function qBReducer(context: IQBContext, action: ActionType) {
  switch (action.type) {
    /**
     * Add new query
     */
    case QBActionType.ADD_QUERY: {
      const uuid = v4();
      return {
        ...context,
        activeQueryId: uuid,
        sqons: [
          ...context.sqons,
          {
            content: [],
            id: uuid,
            op: BooleanOperators.And,
          },
        ],
      };
    }
    /**
     * Duplicate a query
     */
    case QBActionType.DUPLICATE_QUERY: {
      const uuid = v4();
      const { sqons } = context;
      sqons.push({
        ...action.payload,
        id: uuid,
      });
      return {
        ...context,
        sqons: [...sqons],
        activeQueryId: uuid,
      };
    }
    /**
     * Remove a query
     */
    case QBActionType.REMOVE_QUERY: {
      const { activeQueryId } = context;
      const { sqons } = context;
      const index = sqons.findIndex(sqon => sqon.id === action.payload.id);
      sqons.splice(index, 1);

      // queries are now empty
      if (sqons.length === 0) {
        const uuid = v4();
        return {
          ...context,
          activeQueryId: uuid,
          sqons: [
            {
              content: [],
              id: uuid,
              op: BooleanOperators.And,
            },
          ],
        };
      }

      // deleted query is the latest entry
      if (index < sqons.length) {
        return {
          ...context,
          activeQueryId: action.payload.id === activeQueryId ? sqons[index].id : activeQueryId,
          sqons: [...sqons],
        };
      }

      // select next query
      return {
        ...context,
        activeQueryId: action.payload.id === activeQueryId ? sqons[index - 1].id : activeQueryId,
        sqons: [...sqons],
      };
    }
    /**
     * Set new active query
     */
    case QBActionType.SET_ACTIVE_QUERY: {
      return {
        ...context,
        activeQueryId: action.payload.id,
      };
    }
    /**
     * Remove all queries (clear the queries-bar-card)
     */
    case QBActionType.REMOVE_ALL_QUERIES: {
      const uuid = v4();
      return {
        ...context,
        activeQueryId: uuid,
        sqons: [
          {
            content: [],
            id: uuid,
            op: BooleanOperators.And,
          },
        ],
      };
    }
    /**
     * Add or update a multi-select pill to the active query
     */
    case QBActionType.ADD_OR_UPDATE_FACET_PILL: {
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
          sqons: cloneDeep(sqons),
          history: { uuid: v4(), type: PillUserAction.UPDATE, target: field },
        };
      }

      // value is empty, remove pills
      sqons[index].content.splice(fieldIndex, 1);
      return { ...context, sqons: [...sqons], history: { uuid: v4(), type: PillUserAction.UPDATE, target: field } };
    }
    /**
     * Remove multiselect-pill from active query
     */
    case QBActionType.REMOVE_FACET_PILL: {
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
    /**
     * Show/hide labels of all query pill
     */
    case QBActionType.SET_LABELS_ENABLED: {
      return {
        ...context,
        settings: {
          labelsEnabled: action.payload.labelsEnabled,
        },
      };
    }
    /**
     * Something when wrong
     */
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
export function useQBActiveQuery(): ISyntheticSqon {
  const { activeQueryId, sqons } = useQBContext();
  return sqons.find(sqon => sqon.id === activeQueryId) ?? createEmptyQuery();
}

/**
 * Retrieve aggregations
 */
export function useQBAggregations(): AggregationConfig {
  const { aggregations } = useQBContext();
  return aggregations;
}

/**
 * Find and return the AggregationConfig
 */
export function useQBAggregationsNumericalConfig(field: string): IFilterRangeConfig {
  const aggregations = useQBAggregations();
  const config = Object.values(aggregations)
    .flatMap(f => f.items)
    .find(agg => agg.key === field)?.defaults as IFilterRangeConfig;
  return config;
}

/**
 * Return active query sqon
 * The format is converted to be use by the api
 */
export function useQBActiveSqon(): { content: SqonContent; op: SqonOpEnum } {
  const activeQuery = useQBActiveQuery();
  return {
    content: activeQuery.content as SqonContent,
    op: activeQuery.op as SqonOpEnum,
  };
}

/**
 * Return last user action on field
 */
export function useQBHistory(): IHistory {
  const { history } = useQBContext();
  return history;
}

/**
 * Return query-builder settings
 */
export function useQBSettings(): ISettings {
  const { settings } = useQBContext();
  return settings;
}

/**
 * Return usable value for multi-select field (facet or pill)
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

/**
 * Return usable value for boolean field (facet or pill)
 */
export function useQBBooleanValue(field: string): string | null {
  const activeQuery = useQBActiveQuery();
  if (activeQuery.content.length === 0) return null;

  const index = activeQuery.content.findIndex(
    (value: any) =>
      typeof value === 'object' &&
      value !== null &&
      'content' in value &&
      'field' in (value.content as IValueFacet) &&
      (value.content as IValueContent).field === field,
  );

  if (activeQuery.content[index]) {
    const result = (activeQuery.content[index] as IValueFacet).content.value;
    return (result as string[])[0];
  }

  return null;
}

/**
 * Return usable value for numerical field (facet or pill)
 */
export function useQBNumericalSqon(field: string): IValueFacet | undefined {
  const activeQuery = useQBActiveQuery();
  if (activeQuery.content.length === 0) return undefined;

  const index = activeQuery.content.findIndex(
    (value: any) =>
      typeof value === 'object' &&
      value !== null &&
      'content' in value &&
      'field' in (value.content as IValueFacet) &&
      (value.content as IValueContent).field === field,
  );

  if (activeQuery.content[index]) {
    return activeQuery.content[index] as IValueFacet;
  }

  return undefined;
}
