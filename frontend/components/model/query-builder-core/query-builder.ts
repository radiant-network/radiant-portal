import {
  BooleanOperators,
  ISyntheticSqon,
  TSyntheticSqonContent,
} from "../sqon";
import { ISavedFilter } from "../saved-filter";
import { createSavedFilter, SavedFilterInstance } from "./saved-filter";
import { createQuery, QueryInstance } from "./query";
import { PartialKeys } from "../../lib/utils";
import { v4 } from "uuid";
import cloneDeep from "lodash/cloneDeep";
import {
  changeCombineOperatorForQuery,
  cleanUpQueries,
  getDefaultSyntheticSqon,
} from "./utils/sqon";

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
  onFilterCreate?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter is updated
   */
  onFilterUpdate?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter is deleted
   */
  onFilterDelete?(id: string): void;

  /**
   * Callback when a SavedFilter is saved
   */
  onFilterSave?(filter: ISavedFilter): void;

  /**
   * Callback when a Query is selected
   */
  onQuerySelectChange?(selectedIndexes: number[]): void;

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
   * Call this function to create a new SavedFilter.
   * This new filter will be set as the new selectedFilter.
   */
  createSavedFilter(): void;

  /**
   * Call this function to delete a SavedFilter
   */
  deleteSavedFilter(id: string): void;

  /**
   * Call this function to update a SavedFilter
   */
  updateSavedFilter(id: string, data: Omit<ISavedFilter, "id">): void;

  /**
   * Call this function to persist a SavedFilter
   */
  saveSavedFilter(filter: ISavedFilter): void;

  /**
   * Call this function to set the selected SavedFilter
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
   */
  getSavedFilter(id: string): SavedFilterInstance | null;

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
   * Call this function to get the selected Query indexes
   */
  setSelectedQueryIndexes(indexes: number[]): void;

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
   * Call this function to reset the QueryBuilder
   */
  reset: () => void;
};

export const getDefaultQueryBuilderState = (): QueryBuilderState => {
  const defaultUUID = v4();

  return {
    activeQueryId: defaultUUID,
    queries: [getDefaultSyntheticSqon(defaultUUID)],
    selectedQueryIndexes: [],
  };
};

export const createQueryBuilder = (
  coreProps: CoreQueryBuilderProps
): QueryBuilderInstance => {
  const queryBuilder: QueryBuilderInstance = {} as QueryBuilderInstance;

  const coreInstance: QueryBuilderInstance = {
    coreProps,
    reset: () => {
      queryBuilder.setState(() => queryBuilder.coreProps.initialState!);
    },
    getState: () => {
      return queryBuilder.coreProps.state as QueryBuilderState;
    },
    setState: (updater) => {
      queryBuilder.coreProps.onStateChange?.(
        updater(queryBuilder.coreProps.state)
      );
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
          createSavedFilter(queryBuilder, savedFilter)
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
    getSavedFilter: (id) => {
      return (
        queryBuilder
          .getSavedFilters()
          .find((savedFilter) => savedFilter.id === id) || null
      );
    },
    getQueries: () => {
      if (
        queryBuilder.coreProps.state.queries &&
        queryBuilder.coreProps.state.queries.length > 0
      ) {
        return queryBuilder.coreProps.state.queries.map((query) =>
          createQuery(queryBuilder, query)
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
    setSelectedQueryIndexes: (indexes) => {
      queryBuilder.setState((prev) => ({
        ...prev,
        selectedQueryIndexes: indexes,
      }));
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
    createQuery: ({ id = v4(), op = BooleanOperators.and, content }) => {
      const newQuery: ISyntheticSqon = { id, op, content };

      queryBuilder.setRawQueries(
        newQuery.id,
        cleanUpQueries([...queryBuilder.getRawQueries(), newQuery])
      );
      queryBuilder.coreProps.onQueryCreate?.(newQuery);

      return newQuery.id;
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
    changeQueryCombineOperator: (id, operator) => {
      queryBuilder.getQuery(id)?.changeCombineOperator(operator);
    },
    hasQueries: () => {
      return queryBuilder.getQueries().length > 0;
    },
    canCombine: () => {
      return queryBuilder.getQueries().length > 1;
    },
    combineSelectedQueries: (operator: BooleanOperators) => {
      const combinedQuery: ISyntheticSqon = {
        id: v4(),
        op: operator,
        content: queryBuilder.getSelectedQueryIndexes(),
      };
      const selectedQueryIndexes: number[] = [];

      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId: combinedQuery.id,
        queries: [...prev.queries, combinedQuery],
        selectedQueryIndexes,
      }));
      queryBuilder.coreProps.onQueryCreate?.(combinedQuery);
      queryBuilder.coreProps.onQuerySelectChange?.(selectedQueryIndexes);
    },
  };

  Object.assign(queryBuilder, coreInstance);

  return queryBuilder;
};
