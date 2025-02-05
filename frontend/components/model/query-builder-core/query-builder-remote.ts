import { ISyntheticSqon } from "../sqon";
import {
  getDefaultQueryBuilderState,
  QUERY_BUILDER_STATE_CACHE_KEY_PREFIX,
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  QueryBuilderRemoteState,
  QueryBuilderUpdateEvent,
} from "./query-builder";
import isEmpty from "lodash/isEmpty";

/**
 * Update the state of a given QueryBuilder.
 * Dispatch a custom QueryBuilder Update event.
 *
 * @param queryBuilderId QueryBuilder unique identifier
 * @param value The new state value
 * ```
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
  document.dispatchEvent(QBUpdateEvent);
};

const setDefaultLocalQueryBuilderState = (
  queryBuilderId: string
): QueryBuilderRemoteState => {
  const state = getDefaultQueryBuilderState();
  setLocalQueryBuilderState(queryBuilderId, state);
  return state;
};

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
 * Dynamically add new query to a given QueryBuilder
 *
 * @param params
 * ```json
 * - queryBuilderId: QueryBuilder unique identifier
 * - query: Synthetic sqon to add
 * - setAsActive: To set this query as active
 * ```
 */
const addQuery = ({
  query,
  queryBuilderId,
  setAsActive = false,
}: {
  queryBuilderId: string;
  query: ISyntheticSqon;
  setAsActive?: boolean;
}): void => {
  const qbState = getLocalQueryBuilderState(queryBuilderId);
  const queries = qbState?.queries ?? [];
  const hasEmptyQuery = queries.find(({ content }) => isEmpty(content));

  setLocalQueryBuilderState(queryBuilderId, {
    activeQueryId: setAsActive ? query.id : qbState?.activeQueryId ?? query.id!,
    queries: hasEmptyQuery
      ? queries.map((cQuery) => {
          if (isEmpty(cQuery.content)) {
            return query;
          }
          return cQuery;
        })
      : [...queries, query],
  });
};

// TODO add other remote methods

export const queryBuilderRemote = {
  addQuery,
  setLocalQueryBuilderState,
  getLocalQueryBuilderState,
  setDefaultLocalQueryBuilderState,
};
