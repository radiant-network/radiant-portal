import { ISyntheticSqon } from "../../../../model/sqon";
import { ISavedFilter } from "../../../../model/saved-filter";
import { createSavedFilter, SavedFilterInstance } from "./saved-filter";
import { createQuery, QueryInstance } from "./query";
import { PartialKeys } from "../../../../lib/utils";
import { v4 } from "uuid";

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
  savedFilters?: ISavedFilter[];
};

export type CoreQueryBuilderProps = {
  /**
   * Unique ID for the QueryBuilder
   */
  id: string;

  /**
   * State of the QueryBuilder. Use this to control the QueryBuilder
   */
  state: Partial<QueryBuilderState>;

  /**
   * Initial state of the QueryBuilder
   */
  initialState?: Partial<QueryBuilderState>;

  /**
   * Callback when the state of the QueryBuilder changes
   *
   * @param state Partial<QueryBuilderState>
   */
  onStateChange?(state: QueryBuilderState): void;

  /**
   * Callback when a new query is added
   *
   * @param query ISyntheticSqon
   * @returns void
   */
  onQueryAdd?(query: ISyntheticSqon): void;

  /**
   * Callback when a new query is deleted
   *
   * @param queryId: string
   * @returns void
   */
  onQueryDelete?(id: string): void;

  /**
   * Callback when a new query is updated
   *
   * @param query: ISyntheticSqon
   * @returns void
   */
  onQueryUpdate?(query: ISyntheticSqon): void;

  /**
   * Callback when a SavedFilter is created
   *
   * @param filter ISavedFilter
   */
  onFilterCreate?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter is updated
   *
   * @param filter ISavedFilter
   */
  onFilterUpdate?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter is deleted
   *
   * @param filterId string
   */
  onFilterDelete?(id: string): void;

  /**
   * Callback when a SavedFilter is saved
   *
   * @param filter ISavedFilter
   */
  onFilterSave?(filter: ISavedFilter): void;

  /**
   * List of fields to ignore in a Query
   */
  fieldsToIgnore?: string[];
};

export type QueryBuilderProps = PartialKeys<CoreQueryBuilderProps, "state">;

export type QueryBuilderInstance = {
  /**
   * Call this function to get the state of the QueryBuilder
   */
  getState(): QueryBuilderState;

  /**
   * Call this function to set the state of the QueryBuilder
   *
   * @param state QueryBuilderState
   */
  setState(state: QueryBuilderState): void;

  /**
   * Readonly core properties of the QueryBuilder
   */
  coreProps: Readonly<CoreQueryBuilderProps>;

  /**
   * Initial state of the QueryBuilder
   */
  initialState: QueryBuilderState;

  /**
   * Call this function to set the core properties of the QueryBuilder
   *
   * @param coreProps QueryBuilderProps
   */
  setCoreProps(
    newCoreProps: (
      coreProps: Partial<CoreQueryBuilderProps>
    ) => CoreQueryBuilderProps
  ): void;

  /**
   * Call this function to create a new SavedFilter.
   * This new filter will be set as the new selectedFilter.
   */
  createSavedFilter(): void;

  /**
   * Call this function to delete a SavedFilter
   *
   * @param id SavedFilter id
   */
  deleteSavedFilter(id: string): void;

  /**
   * Call this function to update a SavedFilter
   *
   * @param filter SavedFilter
   */
  updateSavedFilter(id: string, data: Omit<ISavedFilter, "id">): void;

  /**
   * Call this function to persist a SavedFilter
   *
   * @param filter SavedFilter
   */
  saveSavedFilter(filter: ISavedFilter): void;

  /**
   * Call this function to set the selected SavedFilter
   *
   * @param id SavedFilter id
   */
  setSelectedSavedFilter(id: string): void;

  /**
   * Call this function to get the selected SavedFilter
   */
  getSelectedSavedFilter(): SavedFilterInstance | null;

  /**
   * Call this function to get the list of SavedFilter
   */
  getSavedFilters(): SavedFilterInstance[];

  /**
   * Call this function to get a SavedFilter by id
   *
   * @param id SavedFilter id
   */
  getSavedFilterById(id: string): SavedFilterInstance | null;

  /**
   * Call this function to add a new Query to the list
   *
   * @param query ISyntheticSqon
   */
  addQuery(query: ISyntheticSqon): void;

  /**
   * Call this function to delete a Query
   *
   * @param id Query id
   */
  deleteQuery(id: string): void;

  /**
   * Call this function to update a Query
   *
   * @param id Query id
   * @param data ISyntheticSqon
   */
  updateQuery(id: string, data: Omit<ISyntheticSqon, "id">): void;

  /**
   * Call this function to duplicate a Query
   *
   * @param id Query id
   */
  duplicateQuery(id: string): void;

  /**
   * Call this function to set the active Query
   *
   * @param id Query id
   */
  getQueryIndexById(id: string): number;

  /**
   * Call this function to get a Query by id
   *
   * @param id Query id
   */
  getQueryById(id: string): QueryInstance | null;

  /**
   * Call this function to get the list of Queries
   *
   * @param id Query id
   */
  getQueries(): QueryInstance[];

  /**
   * Call this function to get the list of Queries
   */
  getRawQueries(): ISyntheticSqon[];

  /**
   * Call this function to get the active Query
   */
  getActiveQuery(): QueryInstance | null;

  /**
   * Call this function to check if the QueryBuilder has queries
   */
  hasQueries(): boolean;

  /**
   * Call this function to check if the QueryBuilder can combine queries
   */
  canCombine(): boolean;

  /**
   * Call this function to reset the QueryBuilder
   */
  reset: () => void;
};

export const createQueryBuilder = (
  coreProps: CoreQueryBuilderProps
): QueryBuilderInstance => {
  const queryBuilder: QueryBuilderInstance = {} as QueryBuilderInstance;

  const coreInstance: QueryBuilderInstance = {
    coreProps,
    initialState: (coreProps.initialState || {}) as QueryBuilderState,
    reset: () => {
      queryBuilder.setState(queryBuilder.initialState);
    },
    getState: () => {
      return queryBuilder.coreProps.state as QueryBuilderState;
    },
    setState: (newState: QueryBuilderState) => {
      queryBuilder.coreProps.onStateChange?.({
        ...queryBuilder.coreProps.state,
        ...newState,
      });
    },
    setCoreProps: (updater) => {
      queryBuilder.coreProps = updater(queryBuilder.coreProps);
    },
    createSavedFilter: () => {},
    deleteSavedFilter: (id: string) => {},
    updateSavedFilter: (id: string, data: Omit<ISavedFilter, "id">) => {},
    saveSavedFilter: (filter: ISavedFilter) => {},
    setSelectedSavedFilter: (id: string) => {},
    getSavedFilters: () => {
      if (
        queryBuilder.coreProps.state.savedFilters &&
        queryBuilder.coreProps.state.savedFilters.length > 0
      ) {
        return queryBuilder.coreProps.state.savedFilters.map((savedFilter) =>
          createSavedFilter(savedFilter)
        );
      }

      return [];
    },
    getSelectedSavedFilter: () => {
      const activeQuery = queryBuilder.getActiveQuery();

      if (activeQuery) {
        return (
          queryBuilder
            .getSavedFilters()
            .find((savedFilter) =>
              savedFilter
                .getQueries()
                .find((query) => query.id === activeQuery.id)
            ) || null
        );
      }

      return null;
    },
    getSavedFilterById: (id: string) => {
      return (
        queryBuilder
          .getSavedFilters()
          .find((savedFilter) => savedFilter.id === id) || null
      );
    },
    getRawQueries: () => {
      return queryBuilder.coreProps.state.queries || [];
    },
    getQueries: () => {
      if (
        queryBuilder.coreProps.state.queries &&
        queryBuilder.coreProps.state.queries.length > 0
      ) {
        return queryBuilder.coreProps.state.queries.map((query) =>
          createQuery(query)
        );
      }

      return [];
    },
    getQueryById: (id: string) => {
      return queryBuilder.getQueries().find((query) => query.id === id) || null;
    },
    getActiveQuery: () => {
      if (!queryBuilder.coreProps.state.activeQueryId) {
        return null;
      }

      return queryBuilder.getQueryById(
        queryBuilder.coreProps.state.activeQueryId
      );
    },
    getQueryIndexById: (id: string) => {
      return queryBuilder.getQueries().findIndex((query) => query.id === id);
    },
    addQuery: (query: Omit<ISyntheticSqon, "id">) => {
      const newQuery: ISyntheticSqon = {
        ...query,
        id: v4(),
      };

      queryBuilder.setState({
        activeQueryId: newQuery.id,
        queries: [...queryBuilder.getRawQueries(), newQuery],
      });
    },
    deleteQuery: (id: string) => {},
    updateQuery: (id: string, data: Omit<ISyntheticSqon, "id">) => {},
    duplicateQuery: (id: string) => {
      const query = queryBuilder.getQueryById(id);

      console.log("duplicateQuery", query);

      if (query) {
        queryBuilder.addQuery(query.syntheticSqon);
      }
    },
    hasQueries: () => {
      return queryBuilder.getQueries().length > 0;
    },
    canCombine: () => {
      return queryBuilder.getQueries().length > 1;
    },
  };

  Object.assign(queryBuilder, coreInstance);

  return queryBuilder;
};
