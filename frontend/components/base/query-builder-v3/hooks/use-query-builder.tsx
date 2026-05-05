/* eslint-disable complexity */
import { createContext, Dispatch, useContext, useReducer } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { v4 } from 'uuid';

import { Count, CountBodyWithSqon, SortBody, Sqon, SqonContent, SqonOpEnum } from '@/api/api';
import { AggregationConfig, IFilterRangeConfig } from '@/components/cores/applications-config';

import { createEmptyQuery, hasEmptyQuery, isEqualToField } from '../libs/sqon';
import { BooleanOperators, ISqonGroupFacet, ISyntheticSqon, IValueContent, IValueFacet, TFacetValue } from '../type';

export const DEFAULT_EMPTY_QUERY = {
  content: [],
  op: 'and',
};

export enum QBActionType {
  ADD_QUERY = 'add-query',
  SELECT_QUERY = 'select-query',
  REMOVE_QUERY = 'remove-query',
  DUPLICATE_QUERY = 'duplicate-query',
  SET_ACTIVE_QUERY = 'set-active-query',
  ADD_OR_UPDATE_FACET_PILL = 'add-or-update-facet-pill',
  REMOVE_FACET_PILL = 'remove-facet-pill',
  REMOVE_COMBINED_PILL = 'remove-combined-pill',
  CHANGE_COMBINER_OPERATOR = 'change-combiner-operator',
  SET_LABELS_ENABLED = 'set-labels-enabled',
  REMOVE_ALL_QUERIES = 'remove-all-queries-all',
  COMBINE_QUERIES = 'combine-queries',
  LOAD_QUERIES = 'load-queries',
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
  combinedQueries: Record<string, string[]>;
}

export interface ICache {
  selectedQueries: string[];
}

export interface ICountInput {
  countBody: CountBodyWithSqon;
}

export interface IQBFetcher {
  list: (params: IListInput) => Promise<any[]>;
  count: (params: ICountInput) => Promise<Count>;
}

export interface ICombinedSqon {
  ids: string[];
}

export interface IQBContext {
  aggregations: AggregationConfig;
  sqons: ISyntheticSqon[];
  activeQueryId: string;
  fetcher: IQBFetcher;
  history: IHistory;
  settings: ISettings;
  cache: ICache;
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
      combinedQueries: {},
    },
    cache: {
      selectedQueries: [],
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
type SelectQuerieAction = {
  type: QBActionType.SELECT_QUERY;
  payload: {
    uuid: string;
    isSelected: boolean;
  };
};
type CombineQueriesAction = {
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
type RemoveCombinedPillAction = {
  type: QBActionType.REMOVE_COMBINED_PILL;
  payload: {
    uuid: string;
    sqon: IValueFacet;
  };
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
type LoadQueriesAction = {
  type: QBActionType.LOAD_QUERIES;
  payload: Sqon[] | undefined;
};

export type ActionType =
  | AddQueryAction
  | SetActiveQueryAction
  | SelectQuerieAction
  | DuplicateQueryAction
  | RemoveQueryAction
  | AddOrUpdateFacetAction
  | RemoveFacetPillAction
  | ChangeCombinerOperatorAction
  | SetLabelsEnabledAction
  | RemoveAllQueriesAction
  | CombineQueriesAction
  | RemoveCombinedPillAction
  | LoadQueriesAction
  | any;

export function qBReducer(context: IQBContext, action: ActionType) {
  switch (action.type) {
    /**
     * Add new query
     */
    case QBActionType.ADD_QUERY: {
      // Don't create a new query if there's already an empty one
      if (hasEmptyQuery(context.sqons)) {
        return context;
      }

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
      const combinedQueries = { ...context.settings.combinedQueries };

      // duplicated query is a combined queries
      if (combinedQueries[action.payload.id]) {
        combinedQueries[uuid] = combinedQueries[action.payload.id];
      }

      return {
        ...context,
        activeQueryId: uuid,
        sqons: [...cloneDeep(sqons), { ...cloneDeep(action.payload), id: uuid }],
        settings: {
          ...context.settings,
          combinedQueries,
        },
      };
    }
    /**
     * Remove a query
     */
    case QBActionType.REMOVE_QUERY: {
      const { activeQueryId } = context;
      let index = context.sqons.findIndex(sqon => sqon.id === action.payload.id);
      let sqons = context.sqons.filter(sqon => sqon.id !== action.payload.id);
      const combinedQueries = { ...context.settings.combinedQueries };

      // queries is a combined queries
      if (combinedQueries[action.payload.id]) {
        delete combinedQueries[action.payload.id];
      }

      // remove sqon from combined queries sqons, clean combinedQueries
      Object.keys(combinedQueries).forEach(key => {
        combinedQueries[key] = combinedQueries[key].filter(id => id != action.payload.id);
      });

      sqons = sqons.map(sqon => ({
        ...sqon,
        content: sqon.content.filter(content => (content as IValueFacet).id !== action.payload.id),
      }));

      // filter sqons for combined queries
      index = index < sqons.length ? index : index - 1;

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
          settings: {
            ...context.settings,
            combinedQueries,
          },
        };
      }

      // select next query
      return {
        ...context,
        activeQueryId: action.payload.id === activeQueryId ? sqons[index].id : activeQueryId,
        sqons,
        settings: {
          ...context.settings,
          combinedQueries,
        },
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
     * Add a query to selectedQueriesList
     * Active combine button when more than one is selected
     */
    case QBActionType.SELECT_QUERY: {
      const { isSelected } = action.payload;
      if (isSelected) {
        return {
          ...context,
          cache: {
            ...context.cache,
            selectedQueries: [...context.cache.selectedQueries, action.payload.uuid],
          },
        };
      }

      return {
        ...context,
        cache: {
          ...context.cache,
          selectedQueries: context.cache.selectedQueries.filter(uuid => uuid != action.payload.uuid),
        },
      };
    }
    /**
     * Combine all selected queries
     */
    case QBActionType.COMBINE_QUERIES: {
      const uuid = v4();
      const { selectedQueries } = context.cache;
      const content = context.sqons.filter(sqon => selectedQueries.includes(sqon.id));

      return {
        ...context,
        activeQueryId: uuid,
        sqons: [
          ...context.sqons,
          {
            id: uuid,
            content,
            op: action.payload,
          },
        ],
        settings: {
          ...context.settings,
          combinedQueries: { ...context.settings.combinedQueries, [uuid]: content.map(c => c.id) },
        },
        cache: {
          selectedQueries: [],
        },
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
     * Load queries (load a saved filter for example)
     */
    case QBActionType.LOAD_QUERIES: {
      const newSqons = action.payload;
      // Set activeQueryId to the first loaded query, or create a new one if empty
      const newActiveQueryId = newSqons?.length > 0 ? newSqons[0].id : v4();

      return {
        ...context,
        activeQueryId: newActiveQueryId,
        sqons:
          newSqons?.length > 0
            ? newSqons
            : [
                {
                  content: [],
                  id: newActiveQueryId,
                  op: BooleanOperators.And,
                },
              ],
      };
    }
    /**
     * Add or update a pill (multi-select, numerical and toggle) to the active query
     */
    case QBActionType.ADD_OR_UPDATE_FACET_PILL: {
      const activeQueryId = context.activeQueryId;
      const index = context.sqons.findIndex(sqon => sqon.id === activeQueryId);

      // active query is empty
      if (index < 0) {
        return {
          ...context,
          sqons: [
            ...context.sqons,
            {
              id: context.activeQueryId,
              content: [action.payload],
              op: BooleanOperators.And,
            },
          ],
        };
      }

      const field = action.payload.content.field;
      const fieldIndex = context.sqons[index].content.findIndex(c => isEqualToField(c, field));
      const combinedQueries = { ...context.settings.combinedQueries };
      const combinedQueryReferences = Object.keys(combinedQueries).filter(key =>
        combinedQueries[key].includes(activeQueryId),
      );

      // field doesn't exist in query, add it
      if (fieldIndex < 0) {
        return {
          ...context,
          sqons: context.sqons.map(sqon => {
            if (sqon.id !== activeQueryId) return sqon;
            return { ...sqon, content: [...sqon.content, action.payload] };
          }),
          history: { uuid: v4(), type: PillUserAction.ADD, target: field },
        };
      }

      // field already existing, add new values in content
      if (action.payload.content.value.length > 0) {
        return {
          ...context,
          sqons: context.sqons.map(sqon => {
            if (combinedQueryReferences.includes(sqon.id)) {
              const content = ((sqon.content as ISqonGroupFacet[]) ?? []).map(content => {
                if (content.id !== activeQueryId) {
                  return content;
                }
                return {
                  ...content,
                  content: content.content.map((c, j) => {
                    if (j != fieldIndex) return c;
                    return action.payload;
                  }),
                };
              });

              return {
                ...sqon,
                content,
              };
            } else if (sqon.id != activeQueryId) {
              return sqon;
            }

            return {
              ...sqon,
              content: sqon.content.map((content, j) => {
                if (j != fieldIndex) return content;
                return action.payload;
              }),
            };
          }),
          history: { uuid: v4(), type: PillUserAction.UPDATE, target: field },
        };
      }

      // value is empty, remove pills
      return {
        ...context,
        sqons: context.sqons.map(sqon => {
          if (sqon.id !== activeQueryId) return sqon;
          return {
            ...sqon,
            content: sqon.content.filter((_, j) => j !== fieldIndex),
          };
        }),
        history: { uuid: v4(), type: PillUserAction.UPDATE, target: field },
      };
    }
    /**
     * Remove pill from active query
     */
    case QBActionType.REMOVE_FACET_PILL: {
      const { activeQueryId } = context;
      const index = context.sqons.findIndex(sqon => sqon.id === activeQueryId);

      // verify active query exists
      if (!context.sqons.some(sqon => sqon.id === activeQueryId)) {
        throw new Error(`Cannot remove pill: ${action.type} ${activeQueryId} ${action.payload}`);
      }

      const combinedQueries = { ...context.settings.combinedQueries };
      const combinedQueryReferences = Object.keys(combinedQueries).filter(key =>
        combinedQueries[key].includes(activeQueryId),
      );

      let isQueryNowEmpty = false;
      const sqons = context.sqons
        .map(sqon => {
          // update sqon
          if (sqon.id === activeQueryId) {
            const content = (sqon.content ?? []).filter(c => !isEqualToField(c, action.payload.content.field));
            if (content.length > 0) {
              return {
                ...sqon,
                content,
              };
            }
            isQueryNowEmpty = true;
            return undefined;
          }
          // update sqon of combined query where the pill is referenced
          if (combinedQueryReferences.includes(sqon.id)) {
            const content = ((sqon.content as ISqonGroupFacet[]) ?? [])
              .map(content => {
                if (content.id !== activeQueryId) {
                  return content;
                }

                const sqonContent = content.content.filter(
                  (c: any) => !isEqualToField(c, action.payload.content.field),
                );
                if (sqonContent.length > 0) {
                  return {
                    ...content,
                    content: sqonContent.filter((c: any) => !isEqualToField(c, action.payload.content.field)),
                  };
                }

                return undefined;
              })
              .filter(c => c !== undefined);

            return {
              ...sqon,
              content,
            };
          }
          return sqon;
        })
        .filter(sqon => sqon != undefined);

      if (isQueryNowEmpty) {
        // remove sqon from combined queries sqons, clean combinedQueries
        Object.keys(combinedQueries).forEach(key => {
          combinedQueries[key] = combinedQueries[key].filter(id => id != action.payload.id);
        });
      }

      // If query is now empty and no other query, create a new empty query
      if (isQueryNowEmpty && sqons.length === 0) {
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
          settings: {
            ...context.settings,
            combinedQueries,
          },
          history: { uuid: v4(), type: PillUserAction.REMOVE, target: action.payload.content.field },
        };
      }

      return {
        ...context,
        activeQueryId: index < sqons.length ? sqons[index].id : sqons[index - 1].id,
        sqons,
        settings: {
          ...context.settings,
          combinedQueries,
        },
        history: { uuid: v4(), type: PillUserAction.REMOVE, target: action.payload.content.field },
      };
    }
    /**
     * Combined pill are reference to another query
     * Must have their own logic to be removed
     */
    case QBActionType.REMOVE_COMBINED_PILL: {
      const combinedQueryUUID = action.payload.uuid;
      const index = context.sqons.findIndex(sqon => sqon.id === action.payload.uuid);
      const combinedQueries = { ...context.settings.combinedQueries };
      combinedQueries[combinedQueryUUID] = combinedQueries[combinedQueryUUID].filter(
        id => id !== action.payload.sqon.id,
      );

      // Remove sqon from combined sqons
      let isQueryNowEmpty = false;
      const sqons = context.sqons
        .map(sqon => {
          if (sqon.id === combinedQueryUUID) {
            // remove sqon from combined pill
            const content = (sqon.content ?? []).filter(
              content => (content as IValueFacet).id !== action.payload.sqon.id,
            );

            if (content.length > 0) {
              return {
                ...sqon,
                content,
              };
            }
            isQueryNowEmpty = true;
            return undefined;
          }
          return sqon;
        })
        .filter(sqon => sqon != undefined);

      return {
        ...context,
        activeQueryId: isQueryNowEmpty ? context.sqons[index - 1].id : combinedQueryUUID,
        sqons,
        settings: {
          ...context.settings,
          combinedQueries,
        },
      };
    }
    /**
     * Change combiner operator (toggle between and | or)
     */
    case QBActionType.CHANGE_COMBINER_OPERATOR: {
      const { activeQueryId } = context;
      const index = context.sqons.findIndex(sqon => sqon.id === activeQueryId);

      if (index < 0) {
        throw Error(`ActiveQueryId does not exist in sqons: ${action.type} ${activeQueryId} ${action.payload}`);
      }

      return {
        ...context,
        sqons: context.sqons.map(sqon => {
          if (sqon.id === activeQueryId) {
            return {
              ...sqon,
              op: action.payload.operator,
            };
          }
          return sqon;
        }),
      };
    }
    /**
     * Show/hide labels of all query pill
     */
    case QBActionType.SET_LABELS_ENABLED: {
      return {
        ...context,
        settings: {
          ...context.settings,
          labelsEnabled: action.payload.labelsEnabled,
        },
      };
    }
    /**
     * Something when wrong
     */
    default: {
      throw Error(`Query builder unknown action: ${action.type} ${JSON.stringify(action.payload)}`);
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
 * Return list of sqon
 */
export function useQBSqons(): ISyntheticSqon[] {
  const { sqons } = useQBContext();
  return sqons;
}

/**
 * Return the number of sqon in sqons
 */
export function useQBSqonsCount(): number {
  const { sqons } = useQBContext();
  return sqons.length;
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
 * Return query-builder settings
 */
export function useQBCache(): ICache {
  const { cache } = useQBContext();
  return cache;
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

/**
 * Return usable value for search field (facet or pill)
 */
export function useQBSearchValue(field: string) {
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
