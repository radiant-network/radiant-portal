import {
  BooleanOperators,
  IRemoteComponent,
  ISyntheticSqon,
  IValueFilter,
  IValueQuery,
  MERGE_VALUES_STRATEGIES,
  RangeOperators,
  TermOperators,
  TSqonGroupOp,
  TSyntheticSqonContent,
  TSyntheticSqonContentValue,
} from "../sqon";
import {
  getDefaultQueryBuilderState,
  QUERY_BUILDER_STATE_CACHE_KEY_PREFIX,
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  QueryBuilderRemoteState,
  QueryBuilderUpdateEvent,
} from "./query-builder";
import isEmpty from "lodash/isEmpty";
import {
  deepMergeFieldInQuery,
  getDefaultSyntheticSqon,
  getFilterWithNoSelection,
  isEmptySqon,
  removeFieldFromSqon,
} from "./utils/sqon";
import { v4 } from "uuid";

/**
 * Set the state of a given QueryBuilder in the local storage and
 * dispatch an event (QUERY_BUILDER_UPDATE_EVENT_KEY) to notify other components of the change.
 */
const setLocalQueryBuilderState = (
  queryBuilderId: string,
  value: QueryBuilderRemoteState
): void => {
  const QBUpdateEvent: QueryBuilderUpdateEvent = new Event(
    QUERY_BUILDER_UPDATE_EVENT_KEY
  );

  QBUpdateEvent.queryBuilderId = queryBuilderId;
  QBUpdateEvent.value = value;

  window.localStorage.setItem(
    `${QUERY_BUILDER_STATE_CACHE_KEY_PREFIX}-${queryBuilderId}`,
    JSON.stringify(value)
  );
  window.dispatchEvent(QBUpdateEvent);
};

/**
 * Set the default state of a given QueryBuilder.
 */
const setDefaultLocalQueryBuilderState = (
  queryBuilderId: string
): QueryBuilderRemoteState => {
  const state = getDefaultQueryBuilderState();
  setLocalQueryBuilderState(queryBuilderId, state);
  return state;
};

/**
 * Get the state of a given QueryBuilder from the local storage.
 */
const getLocalQueryBuilderState = (
  queryBuilderId: string
): QueryBuilderRemoteState => {
  const qbState = window.localStorage.getItem(
    `${QUERY_BUILDER_STATE_CACHE_KEY_PREFIX}-${queryBuilderId}`
  );

  if (!qbState) {
    return setDefaultLocalQueryBuilderState(queryBuilderId);
  }

  try {
    return JSON.parse(qbState);
  } catch (err) {
    return setDefaultLocalQueryBuilderState(queryBuilderId);
  }
};

/**
 * Add new query to a given QueryBuilder
 */
const addQuery = (
  queryBuilderId: string,
  query: ISyntheticSqon,
  setAsActive: boolean = false
): void => {
  const qbState = getLocalQueryBuilderState(queryBuilderId);
  const queries = qbState?.queries ?? [];
  const hasEmptyQuery = queries.find((q) => isEmptySqon(q));

  setLocalQueryBuilderState(queryBuilderId, {
    activeQueryId: setAsActive
      ? query.id
      : (qbState?.activeQueryId ?? query.id),
    queries: hasEmptyQuery
      ? queries.map((q) => {
          if (isEmptySqon(q)) {
            return query;
          }
          return q;
        })
      : [...queries, query],
  });
};

/**
 * Get the active query of a given QueryBuilder
 */
const getActiveQuery = (queryBuilderId: string): ISyntheticSqon => {
  const qbState = getLocalQueryBuilderState(queryBuilderId);
  return (
    qbState?.queries?.find(({ id }) => id === qbState.activeQueryId) ??
    getDefaultSyntheticSqon()
  );
};

/**
 * Update a query of a given QueryBuilder
 */
const updateQuery = (queryBuilderId: string, query: ISyntheticSqon) => {
  const qbState = getLocalQueryBuilderState(queryBuilderId);
  const queryToUpdate = qbState?.queries?.find(({ id }) => id === query.id);
  if (queryToUpdate) {
    queryToUpdate.content = query.content;
    queryToUpdate.op = query.op;
  }

  setLocalQueryBuilderState(queryBuilderId, qbState);
};

/**
 * Update the active query field of a given QueryBuilder
 *
 * @param params
 * ```json
 * - queryBuilderId: QueryBuilder unique identifier
 * - field: Field name to update
 * - value: List of values for the given field
 * - merge_strategy: How to merge the values
 * - operator: Term operator
 * - index: Index related to the field
 * ```
 */
const updateActiveQueryField = (
  queryBuilderId: string,
  {
    field,
    index,
    isUploadedList,
    merge_strategy = MERGE_VALUES_STRATEGIES.APPEND_VALUES,
    operator = TermOperators.in,
    overrideValuesName,
    remoteComponent,
    value,
  }: {
    field: string;
    value: Array<string | number | boolean>;
    merge_strategy?: MERGE_VALUES_STRATEGIES;
    operator?: TermOperators | RangeOperators;
    index?: string;
    overrideValuesName?: string;
    isUploadedList?: boolean;
    remoteComponent?: IRemoteComponent;
  }
): void => {
  const activeQuery = queryBuilderRemote.getActiveQuery(queryBuilderId);

  updateQuery(
    queryBuilderId,
    isEmpty(value)
      ? removeFieldFromSqon(field, activeQuery)
      : deepMergeFieldInQuery({
          sqon: activeQuery,
          field,
          index,
          isUploadedList,
          merge_strategy,
          operator,
          overrideValuesName,
          remoteComponent,
          value,
        })
  );
};

/**
 * Update the filters of the active query of a given QueryBuilder
 * by generating sqon content using FilterGroup and Filter
 *
 * @param params
 * ```json
 * - filterGroup: FilterGroup config
 * - selectedFilters: Selected filter value list
 * - index: Index related to the selected filters
 * ```
 */
const updateActiveQueryFilters = (
  queryBuilderId: string,
  params: {
    filterGroup: any; // TODO change with FilterGroup type
    selectedFilters: any[]; // TODO change with Filter type
    index?: string;
    operator?: TSqonGroupOp;
  }
): void => {
  console.warn("updateActiveQueryFilters is not implemented yet");
};

const getUpdatedActiveQuery = (
  queryBuilderId: string,
  {
    field,
    operator = BooleanOperators.and,
    sqonContent,
  }: {
    field: string;
    sqonContent: TSyntheticSqonContent;
    operator?: TSqonGroupOp;
  }
): ISyntheticSqon => {
  const activeQuery = getActiveQuery(queryBuilderId);

  let newQuery: ISyntheticSqon = {
    id: v4(),
    content: sqonContent,
    op: operator,
  };

  if (!isEmpty(activeQuery)) {
    const results = getFilterWithNoSelection(activeQuery, field);
    const fieldIndex = results[0];
    const initialResults = results[1] as ISyntheticSqon;
    const filterWithoutSelection = { ...initialResults };

    if (isEmpty(filterWithoutSelection.content) && isEmpty(activeQuery)) {
      newQuery = { id: v4(), content: [], op: operator };
    } else {
      if ((fieldIndex as number) >= 0) {
        filterWithoutSelection.content.splice(
          fieldIndex as number,
          0,
          ...sqonContent
        );
      } else {
        filterWithoutSelection.content = [
          ...filterWithoutSelection.content,
          ...sqonContent,
        ];
      }

      newQuery = {
        ...filterWithoutSelection,
        content: [...filterWithoutSelection.content],
      };

      if (initialResults.content.length === 0) {
        newQuery.op = operator;
      }
    }
  }

  return newQuery;
};

/**
 * Update the query of a given QueryBuilder by table filter
 */
const updateQueryByTableFilter = (
  queryBuilderId: string,
  params: {
    field: string;
    selectedFilters: any[]; // TODO change with Filter type
  }
): void => {
  console.warn("updateQueryByTableFilter is not implemented yet");
};

/**
 * Remove a pill from the active query of a given QueryBuilder
 */
const removePillFromActiveQuery = (
  queryBuilderId: string,
  pillId: string
): void => {
  const qbState = getLocalQueryBuilderState(queryBuilderId);
  const updatedQueries: ISyntheticSqon[] = qbState?.queries?.map(
    (sqon: ISyntheticSqon) => {
      const newContent = sqon.content.map(
        (sqonContent: TSyntheticSqonContentValue) => {
          if ((sqonContent as IValueFilter).id !== pillId) return sqonContent;
        }
      );
      return { ...sqon, content: newContent.filter((el) => el !== undefined) };
    }
  );
  setLocalQueryBuilderState(queryBuilderId, {
    ...qbState,
    queries: updatedQueries,
  });
};

/*
 * Add a pill to the active query of a given QueryBuilder
 */
const addPillToActiveQuery = (
  queryBuilderId: string,
  pill: IValueQuery
): void => {
  const activeQuery = getActiveQuery(queryBuilderId);
  updateQuery(queryBuilderId, {
    ...activeQuery,
    content: [...activeQuery.content, pill],
  });
};

export const queryBuilderRemote = {
  addQuery,
  getActiveQuery,
  updateActiveQueryField,
  updateActiveQueryFilters,
  addPillToActiveQuery,
  removePillFromActiveQuery,
  setLocalQueryBuilderState,
  getLocalQueryBuilderState,
  setDefaultLocalQueryBuilderState,
};
