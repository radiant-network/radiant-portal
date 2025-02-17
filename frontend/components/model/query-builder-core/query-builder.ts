import {
  BooleanOperators,
  ISyntheticSqon,
  TSyntheticSqonContent,
} from "../sqon";
import { getNewSavedFilter } from "./utils/saved-filter";
import { ISavedFilter } from "../saved-filter";
import { createSavedFilter, SavedFilterInstance } from "./saved-filter";
import { createQuery, QueryInstance } from "./query";
import { v4 } from "uuid";
import {
  cleanUpQueries,
  formatQueriesWithPill,
  getDefaultSyntheticSqon,
} from "./utils/sqon";

export const QUERY_BUILDER_STATE_CACHE_KEY_PREFIX = "query-builder-cache";
export const QUERY_BUILDER_UPDATE_EVENT_KEY = "QBCacheUpdate";

export type QueryBuilderRemoteState = Pick<
  QueryBuilderState,
  "activeQueryId" | "queries"
>;

export type QueryBuilderUpdateEvent = Event & {
  queryBuilderId?: string;
  value?: QueryBuilderRemoteState;
};

export type QueryBuilderState = {
  /**
   * Id of the active query
   */
  activeQueryId: string;

  /**
   * List of queries
   */
  queries: ISyntheticSqon[];

  /**
   * List of saved filters
   */
  savedFilters: ISavedFilter[];

  /**
   * List of selected query indexes
   */
  selectedQueryIndexes: number[];
};

export type CoreQueryBuilderProps = {
  /**
   * Unique ID for the QueryBuilder
   */
  id: string;

  /**
   * State of the QueryBuilder. Use this to control the QueryBuilder
   */
  state: QueryBuilderState;

  /**
   * Initial state of the QueryBuilder
   */
  initialState?: QueryBuilderState;

  /**
   * Default title for a SavedFilter
   */
  savedFilterDefaultTitle?: string;

  /**
   * Callback when the state of the QueryBuilder changes
   */
  onStateChange?(state: QueryBuilderState): void;

  /**
   * Callback when a new query is added
   */
  onQueryCreate?(query: ISyntheticSqon): void;

  /**
   * Callback when a new query is updated
   */
  onQueryUpdate?(id: string, query: ISyntheticSqon): void;

  /**
   * Callback when a new query is deleted
   */
  onQueryDelete?(id: string): void;

  /**
   * Callback when a SavedFilter is created
   */
  onSavedFilterCreate?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter is deleted
   */
  onSavedFilterDelete?(id: string): { savedFilterId: string };

  /**
   * Callback when a SavedFilter is saved
   */
  onSavedFilterSave?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter favorite changes
   */
  onSavedFilterFavoriteChange?(id: string, favorite: boolean): ISavedFilter;

  /**
   * Callback when a Query is selected
   */
  onQuerySelectChange?(selectedIndexes: number[]): void;

  /**
   * List of fields to ignore in a Query
   */
  fieldsToIgnore?: string[];
};

export type QueryBuilderInstance = {
  /**
   * Call this function to get the state of the QueryBuilder
   */
  getState(): QueryBuilderState;

  /**
   * Call this function to set the state of the QueryBuilder
   */
  setState(newState: (prevState: QueryBuilderState) => QueryBuilderState): void;

  /**
   * Readonly core properties of the QueryBuilder
   */
  coreProps: Readonly<CoreQueryBuilderProps>;

  /**
   * Call this function to set the core properties of the QueryBuilder
   */
  setCoreProps(
    newCoreProps: (
      prevCoreProps: CoreQueryBuilderProps
    ) => CoreQueryBuilderProps
  ): void;

  /**
   * Call this function to save the current filter
   */
  saveNewFilter: (params?: { title?: string; favorite?: boolean }) => void;

  /**
   * Call this function to create a new SavedFilter.
   * This new filter will be set as the new selectedFilter.
   */
  createSavedFilter(): void;

  /**
   * Call this function to get the selected SavedFilter
   */
  getSelectedSavedFilter(): SavedFilterInstance | null;

  /**
   * Call this function to get the list of SavedFilter
   * excluding new unsaved filter
   */
  getSavedFilters(): SavedFilterInstance[];

  /**
   * Call this function to add a new Query to the list
   */
  createQuery(input: {
    id?: string;
    op: BooleanOperators;
    content: TSyntheticSqonContent;
  }): string;

  /**
   * Call this function to delete a Query
   */
  deleteQuery(id: string): void;

  /**
   * Call this function to update a Query
   */
  updateQuery(id: string, data: Omit<ISyntheticSqon, "id">): void;

  /**
   * Call this function to duplicate a Query
   */
  duplicateQuery(id: string): void;

  /**
   * Call this function to select a Query
   */
  selectQuery(id: string): void;

  /**
   * Call this function to unselect a Query
   */
  unselectQuery(id: string): void;

  /**
   * Call this function to reset Query selection
   */
  resetQuerySelection(): void;

  /**
   * Call this function to get the selected Query indexes
   */
  getSelectedQueryIndexes(): number[];

  /**
   * Call this function to set the active Query
   *
   * @return The query index or -1 if the query is not found
   */
  getQueryIndex(id: string): number;

  /**
   * Call this function to get a Query by id
   */
  getQuery(id: string): QueryInstance | null;

  /**
   * Call this function to get the list of Queries
   */
  getQueries(): QueryInstance[];

  /**
   * Call this function to get the list of Queries
   */
  getRawQueries(): ISyntheticSqon[];

  /**
   * Call this function to check if the QueryBuilder has at least one empty query
   */
  hasEmptyQuery(): boolean;

  /**
   * Call this function to check if the QueryBuilder is empty,
   * meaning there is maximum one query and it is empty
   */
  isEmpty(): boolean;

  /**
   * Call this function to set the active Query
   */
  setActiveQuery(id: string): void;

  /**
   * Call this function to get the active Query
   */
  getActiveQuery(): QueryInstance | null;

  /**
   *  Call this function to change the combine operator of a Query
   */
  changeQueryCombineOperator: (id: string, operator: BooleanOperators) => void;

  /**
   * Call this function to set the Queries list
   */
  setRawQueries(activeQueryId: string, newQueries: ISyntheticSqon[]): void;

  /**
   * Call this function to reset the Queries
   */
  resetQueries(activeQueryId: string): void;

  /**
   * Call this function to check if the QueryBuilder has queries
   */
  hasQueries(): boolean;

  /**
   * Call this function to check if the QueryBuilder can combine queries
   */
  canCombine(): boolean;

  /**
   * Call this function to combine selected queries
   */
  combineSelectedQueries(operator: BooleanOperators): void;

  /**
   * Call this function to clear all queries
   */
  clearQueries: () => void;

  /**
   * Call this function to reset the QueryBuilder
   */
  reset: () => void;
};

export const getDefaultQueryBuilderState = (): QueryBuilderState => {
  const defaultUUID = v4();

  return {
    activeQueryId: defaultUUID,
    queries: [getDefaultSyntheticSqon(defaultUUID)],
    savedFilters: [],
    selectedQueryIndexes: [],
  };
};

export const createQueryBuilder = (
  coreProps: CoreQueryBuilderProps
): QueryBuilderInstance => {
  const queryBuilder: QueryBuilderInstance = {} as QueryBuilderInstance;

  const coreInstance: QueryBuilderInstance = {
    coreProps,
    setCoreProps: (updater) => {
      queryBuilder.coreProps = updater(queryBuilder.coreProps);
    },
    setState: (updater) => {
      queryBuilder.coreProps.onStateChange?.(
        updater(queryBuilder.coreProps.state)
      );
    },
    getState: () => {
      return queryBuilder.coreProps.state as QueryBuilderState;
    },
    reset: () => {
      queryBuilder.setState(() => queryBuilder.coreProps.initialState!);
    },
    clearQueries: () => {
      const newActiveId = v4();
      const defaultQuery = getDefaultSyntheticSqon(newActiveId);

      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId: newActiveId,
        queries: [defaultQuery],
      }));
    },
    saveNewFilter: (params) => {
      const savedFilterToSave: ISavedFilter = {
        id: v4(),
        title:
          params?.title ||
          queryBuilder.coreProps.savedFilterDefaultTitle ||
          "New Filter",
        favorite: params?.favorite === undefined ? false : params.favorite,
        queries: formatQueriesWithPill(queryBuilder.getRawQueries()),
      };

      queryBuilder.coreProps.onSavedFilterSave?.(savedFilterToSave);

      queryBuilder.setState((prev) => ({
        ...prev,
        savedFilters: [
          ...prev.savedFilters,
          {
            ...savedFilterToSave,
            isNew: false,
            isDirty: false,
          },
        ],
      }));
    },
    createSavedFilter: () => {
      const { newActiveQueryId, newSavedFilter } = getNewSavedFilter();

      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId: newActiveQueryId,
        queries: newSavedFilter.queries,
        savedFilters: [...prev.savedFilters, newSavedFilter],
      }));

      queryBuilder.coreProps.onSavedFilterCreate?.(newSavedFilter);
    },
    getSelectedSavedFilter: () => {
      const activeQuery = queryBuilder.getActiveQuery();

      if (activeQuery) {
        return (
          queryBuilder
            .getSavedFilters()
            .find(
              (savedFilter) => savedFilter.isSelected() && !savedFilter.isNew()
            ) || null
        );
      }

      return null;
    },
    getSavedFilters: () => {
      if (
        queryBuilder.coreProps.state.savedFilters &&
        queryBuilder.coreProps.state.savedFilters.length > 0
      ) {
        return queryBuilder.coreProps.state.savedFilters
          .map((savedFilter) => createSavedFilter(savedFilter, queryBuilder))
          .filter((filter) => !filter.isNew());
      }

      return [];
    },
    getQueries: () => {
      if (
        queryBuilder.coreProps.state.queries &&
        queryBuilder.coreProps.state.queries.length > 0
      ) {
        return queryBuilder.coreProps.state.queries.map((query) =>
          createQuery(query, queryBuilder)
        );
      }

      return [];
    },
    getRawQueries: () => {
      return queryBuilder.coreProps.state.queries || [];
    },
    getSelectedQueryIndexes: () => {
      return queryBuilder.getState().selectedQueryIndexes;
    },
    selectQuery: (id) => {
      queryBuilder.getQuery(id)?.select();
    },
    unselectQuery: (id) => {
      queryBuilder.getQuery(id)?.unselect();
    },
    resetQuerySelection: () => {
      queryBuilder.setState((prev) => ({
        ...prev,
        selectedQueryIndexes: [],
      }));
      queryBuilder.coreProps.onQuerySelectChange?.([]);
    },
    createQuery: ({ id = v4(), op = BooleanOperators.and, content }) => {
      const newQuery: ISyntheticSqon = { id, op, content };

      queryBuilder.setRawQueries(
        newQuery.id,
        cleanUpQueries([...queryBuilder.getRawQueries(), newQuery])
      );
      queryBuilder.coreProps.onQueryCreate?.(newQuery);

      return newQuery.id;
    },
    getQuery: (id) => {
      return queryBuilder.getQueries().find((query) => query.id === id) || null;
    },
    setActiveQuery: (id) => {
      queryBuilder.getQuery(id)?.setAsActive();
    },
    getActiveQuery: () => {
      if (!queryBuilder.coreProps.state.activeQueryId) {
        return null;
      }

      return queryBuilder.getQuery(queryBuilder.coreProps.state.activeQueryId);
    },
    getQueryIndex: (id) => {
      const query = queryBuilder.getQuery(id);

      return query ? query.index() : -1;
    },
    updateQuery: (id, updatedQuery) => {
      queryBuilder.getQuery(id)?.update(updatedQuery);
    },
    duplicateQuery: (id) => {
      queryBuilder.getQuery(id)?.duplicate();
    },
    deleteQuery: (id) => {
      queryBuilder.getQuery(id)?.delete();
    },
    changeQueryCombineOperator: (id, operator) => {
      queryBuilder.getQuery(id)?.changeCombineOperator(operator);
    },
    hasEmptyQuery: () => {
      return queryBuilder.getQueries().some((query) => query.isEmpty());
    },
    hasQueries: () => {
      return queryBuilder.getQueries().length > 0;
    },
    canCombine: () => {
      return (
        queryBuilder.getQueries().length > 1 &&
        queryBuilder.getSelectedQueryIndexes().length > 1
      );
    },
    setRawQueries: (activeQueryId, newQueries) => {
      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId,
        queries: newQueries,
      }));
    },
    resetQueries: (activeQueryId) => {
      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId,
        queries: [getDefaultSyntheticSqon(activeQueryId)],
      }));
    },
    combineSelectedQueries: (operator: BooleanOperators) => {
      if (!queryBuilder.canCombine()) {
        console.error(
          "Cannot combine queries. There must be at least 2 queries selected."
        );
        return;
      }

      const combinedQuery: ISyntheticSqon = {
        id: v4(),
        op: operator,
        content: queryBuilder.getSelectedQueryIndexes().sort(),
      };
      const selectedQueryIndexes: number[] = [];

      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId: combinedQuery.id,
        queries: cleanUpQueries([...prev.queries, combinedQuery]),
        selectedQueryIndexes,
      }));
      queryBuilder.coreProps.onQueryCreate?.(combinedQuery);
      queryBuilder.coreProps.onQuerySelectChange?.(selectedQueryIndexes);
    },
    isEmpty: () => {
      return (
        queryBuilder.getQueries().length === 1 &&
        queryBuilder.getQueries()[0].isEmpty()
      );
    },
  };

  Object.assign(queryBuilder, coreInstance);

  return queryBuilder;
};
