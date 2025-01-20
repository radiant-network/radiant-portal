import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { v4 } from "uuid";

import {
  BooleanOperators,
  RangeOperators,
  TermOperators,
} from "../../../utils/sqon/operators";
import {
  IRemoteComponent,
  IValueFilter,
  IValueQuery,
  TSqonGroupOp,
  TSyntheticSqonContentValue,
} from "../../../utils/sqon/types";
import {
  ISyntheticSqon,
  MERGE_VALUES_STRATEGIES,
} from "../../../utils/sqon/types";
import {
  createInlineFilters,
  deepMergeFieldInActiveQuery,
  getDefaultSyntheticSqon,
  getUpdatedActiveQuery,
  getUpdatedActiveQueryByFilterGroup,
  removeFieldFromActiveQuery,
} from "../../../utils/sqon/utils";
import { IFilter, IFilterGroup } from "../../Filters/types";
import { IQueryBuilderState } from "../types";

export const QB_UPDATE_EVENT_KEY = "QBCacheUpdate";
export const QB_CACHE_KEY_PREFIX = "query-builder-cache";

type TQBStateUpdateEvent = Event & {
  qbID?: string;
  value?: IQueryBuilderState;
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

/**
 * Get the current active query from a given QueryBuilder
 *
 * @param queryBuilderId QueryBuilder unique identifier
 */
export const getActiveQuery = (queryBuilderId: string): ISyntheticSqon => {
  const qbState = getQueryBuilderState(queryBuilderId);
  return (
    qbState?.state?.find(({ id }) => id === qbState.active) ?? {
      content: [],
      op: BooleanOperators.and,
    }
  );
};

/**
 * Dynamically update the filters of the active query of a given QueryBuilder
 * by generating sqon content using FilterGroup and Filter
 *
 * @param params
 * ```json
 * - queryBuilderId: QueryBuilder unique identifier
 * - filterGroup: FilterGroup config
 * - selected: Selected filter value list
 * - index: Index related to the selected filters
 * ```
 */
export const updateActiveQueryFilters = ({
  filterGroup,
  index,
  operator,
  queryBuilderId,
  selectedFilters,
}: {
  queryBuilderId: string;
  filterGroup: IFilterGroup;
  selectedFilters: IFilter[];
  index?: string;
  operator?: TSqonGroupOp;
}): void =>
  updateQuery({
    query: getUpdatedActiveQueryByFilterGroup({
      filterGroup,
      index,
      operator,
      queryBuilderId,
      selectedFilters,
    }),
    queryBuilderId,
  });

/**
 * Dynamically update field value of the active query of a given QueryBuilder by
 * deep merging the values using a Merge Strategy
 *
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
export const updateActiveQueryField = ({
  field,
  index,
  isUploadedList,
  merge_strategy = MERGE_VALUES_STRATEGIES.APPEND_VALUES,
  operator = TermOperators.in,
  overrideValuesName,
  queryBuilderId,
  remoteComponent,
  value,
}: {
  queryBuilderId: string;
  field: string;
  value: Array<string | number | boolean>;
  merge_strategy?: MERGE_VALUES_STRATEGIES;
  operator?: TermOperators | RangeOperators;
  index?: string;
  overrideValuesName?: string;
  isUploadedList?: boolean;
  remoteComponent?: IRemoteComponent;
}): void =>
  updateQuery({
    query: isEmpty(value)
      ? removeFieldFromActiveQuery(queryBuilderId, field)
      : deepMergeFieldInActiveQuery({
          field,
          index,
          isUploadedList,
          merge_strategy,
          operator,
          overrideValuesName,
          queryBuilderId,
          remoteComponent,
          value,
        }),
    queryBuilderId,
  });

export const updateQuery = ({
  query,
  queryBuilderId,
}: {
  queryBuilderId: string;
  query: ISyntheticSqon;
}) => {
  const qbState = getQueryBuilderState(queryBuilderId);
  const queryToUpdate = qbState?.state?.find(({ id }) => id === query.id);
  if (queryToUpdate) {
    queryToUpdate.content = query.content;
    queryToUpdate.op = query.op;
  }

  qbState && setQueryBuilderState(queryBuilderId, qbState);
};

export const updateQueryByTableFilter = ({
  field,
  queryBuilderId,
  selectedFilters,
}: {
  queryBuilderId: string;
  field: string;
  selectedFilters: IFilter[];
}): void =>
  updateQuery({
    query:
      selectedFilters.length > 0
        ? getUpdatedActiveQuery({
            field,
            queryBuilderId: queryBuilderId,
            sqonContent: createInlineFilters(field, selectedFilters),
          })
        : removeFieldFromActiveQuery(queryBuilderId, field),
    queryBuilderId: queryBuilderId,
  });

export const removePillFromQueryBuilder = (
  pillId: string,
  queryBuilderId: string
): void => {
  const qbState = getQueryBuilderState(queryBuilderId);
  const updatedState = qbState?.state?.map((sqon: ISyntheticSqon) => {
    const newContent = sqon.content.map(
      (sqonContent: TSyntheticSqonContentValue) => {
        if ((sqonContent as IValueFilter).id !== pillId) return sqonContent;
      }
    );
    return { ...sqon, content: newContent.filter((el) => el !== undefined) };
  });
  setQueryBuilderState(queryBuilderId, {
    ...qbState,
    state: updatedState as ISyntheticSqon[],
  });
};

export const addPillToQueryBuilder = (
  pill: IValueQuery,
  queryBuilderId: string
): void => {
  const activeQuery = getActiveQuery(queryBuilderId);
  updateQuery({
    query: { ...activeQuery, content: [...activeQuery.content, pill] },
    queryBuilderId,
  });
};

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
  value: IQueryBuilderState
): void => {
  const QBUpdateEvent: TQBStateUpdateEvent = new Event(QB_UPDATE_EVENT_KEY);

  QBUpdateEvent.qbID = queryBuilderId;
  QBUpdateEvent.value = value;

  window.localStorage.setItem(
    `${QB_CACHE_KEY_PREFIX}-${queryBuilderId}`,
    JSON.stringify(value)
  );
  document.dispatchEvent(QBUpdateEvent);
};

export const defaultQueryBuilderState = (
  queryBuilderId: string
): IQueryBuilderState => {
  const defaultSqon = getDefaultSyntheticSqon();
  const newQbState: IQueryBuilderState = {
    active: defaultSqon.id,
    state: [defaultSqon],
  };
  setQueryBuilderState(queryBuilderId, newQbState);
  return newQbState;
};

export const getQueryBuilderState = (
  queryBuilderId: string
): IQueryBuilderState | undefined => {
  if (typeof window === "undefined") return;

  const qbState = window.localStorage.getItem(
    `${QB_CACHE_KEY_PREFIX}-${queryBuilderId}`
  );

  if (!qbState) {
    return defaultQueryBuilderState(queryBuilderId);
  }

  try {
    return JSON.parse(qbState);
  } catch (err) {
    return defaultQueryBuilderState(queryBuilderId);
  }
};

/**
 * Custom hook used to listen to state changes for a given QueryBuilder.
 *
 * @param queryBuilderId: QueryBuilder unique identifier
 *
 * @returns The state and the activeQuery of the QueryBuilder.
 */
const useQueryBuilderState = (queryBuilderId: string) => {
  const [state, setState] = useState<IQueryBuilderState | undefined>(
    getQueryBuilderState(queryBuilderId)
  );

  useEffect(() => {
    const listener = (event: TQBStateUpdateEvent) => {
      if (event.qbID === queryBuilderId) {
        setState({
          active: event.value?.active ?? v4(),
          state: event.value?.state ?? [],
        });
      }
    };

    document.addEventListener(QB_UPDATE_EVENT_KEY, listener);

    return () => document.removeEventListener(QB_UPDATE_EVENT_KEY, listener);
  }, []);

  return {
    activeQuery: getActiveQuery(queryBuilderId),
    activeQueryId: state?.active,
    queryList: state?.state ?? [],
    state,
  };
};

export default useQueryBuilderState;
