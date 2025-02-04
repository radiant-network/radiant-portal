import {
  getDefaultQueryBuilderState,
  QUERY_BUILDER_STATE_CACHE_KEY_PREFIX,
  QUERY_BUILDER_UPDATE_EVENT_KEY,
  QueryBuilderRemoteState,
  QueryBuilderUpdateEvent,
} from "./query-builder";

/**
 * Update the state of a given QueryBuilder.
 * Dispatch a custom QueryBuilder Update event.
 *
 * @param queryBuilderId QueryBuilder unique identifier
 * @param value The new state value
 * ```
 */
export const setQueryBuilderState = (
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

export const setDefaultQueryBuilderState = (
  queryBuilderId: string
): QueryBuilderRemoteState => {
  const state = getDefaultQueryBuilderState();
  setQueryBuilderState(queryBuilderId, state);
  return state;
};

export const getQueryBuilderState = (
  queryBuilderId: string
): QueryBuilderRemoteState | undefined => {
  const qbState = window.localStorage.getItem(
    `${QUERY_BUILDER_STATE_CACHE_KEY_PREFIX}-${queryBuilderId}`
  );
  if (!qbState) {
    return setDefaultQueryBuilderState(queryBuilderId);
  }

  try {
    return JSON.parse(qbState);
  } catch (err) {
    return setDefaultQueryBuilderState(queryBuilderId);
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
export const addQuery = ({
  query,
  queryBuilderId,
  setAsActive = false,
}: {
  queryBuilderId: string;
  query: ISyntheticSqon;
  setAsActive?: boolean;
}): void => {
  const qbState = getQueryBuilderState(queryBuilderId);
  const queries = qbState?.state ?? [];
  const hasEmptyQuery = queries.find(({ content }) => isEmpty(content));

  setQueryBuilderState(queryBuilderId, {
    active: setAsActive ? query.id! : qbState?.active ?? query.id!,
    state: hasEmptyQuery
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
