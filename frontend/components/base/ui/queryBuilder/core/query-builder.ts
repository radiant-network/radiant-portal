import { ISyntheticSqon } from "@/model/sqon";
import { ISavedFilter } from "@/model/saved-filter";
import { SavedFilterInstance } from "./saved-filter";
import { QueryInstance } from "./query";

export type QueryBuilderState = {
  /**
   * Id of the active query
   */
  activeQueryId?: string;

  /**
   * List of queries
   */
  queries?: ISyntheticSqon[];

  /**
   * List of saved filters
   */
  savedFilters?: ISavedFilter[];
};

export type QueryBuilderInitialState = Partial<QueryBuilderState>;

export type QueryBuilderProps = {
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
  initialState?: QueryBuilderInitialState;

  /**
   * Callback when the state of the QueryBuilder changes
   *
   * @param state Partial<QueryBuilderState>
   */
  onStateChange?(state: Partial<QueryBuilderState>): void;

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
  setState(state: Partial<QueryBuilderState>): void;

  /**
   * Readonly core properties of the QueryBuilder
   */
  coreProps: Readonly<QueryBuilderProps>;

  /**
   * Initial state of the QueryBuilder
   */
  initialState: QueryBuilderInitialState;

  /**
   * Call this function to set the core properties of the QueryBuilder
   *
   * @param coreProps QueryBuilderProps
   */
  setCoreProps(
    newCoreProps: (coreProps: Partial<QueryBuilderProps>) => QueryBuilderProps
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
  getSelectedSavedFilter(): SavedFilterInstance;

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
   * Call this function to get the active Query
   */
  getActiveQuery(): QueryInstance;

  /**
   * Call this function to check if the QueryBuilder has queries
   */
  hasQueries(): boolean;

  /**
   * Call this function to check if the QueryBuilder can combine queries
   */
  canCombine(): boolean;
};

export const createQueryBuilder = (
  props: QueryBuilderProps
): QueryBuilderInstance => {
  const queryBuilder: QueryBuilderInstance = {} as QueryBuilderInstance;

  const coreInstance: QueryBuilderInstance = {
    initialState: props.initialState || {},
    getState: () => {
      return queryBuilder.coreProps.state;
    },
    setState: (newState: Partial<QueryBuilderState>) => {
      queryBuilder.coreProps.onStateChange?.(newState);
    },
    coreProps: props,
    setCoreProps: (updater) => {
      queryBuilder.coreProps = updater(queryBuilder.coreProps);
    },
    createSavedFilter: () => {},
    deleteSavedFilter: (id: string) => {},
    updateSavedFilter: (id: string, data: Omit<ISavedFilter, "id">) => {},
    saveSavedFilter: (filter: ISavedFilter) => {},
    setSelectedSavedFilter: (id: string) => {},
    getSelectedSavedFilter: () => {
      return {} as SavedFilterInstance;
    },
    getSavedFilters: () => {
      return [] as SavedFilterInstance[];
    },
    getSavedFilterById: (id: string) => {
      return {} as SavedFilterInstance;
    },
    addQuery: (query: ISyntheticSqon) => {},
    deleteQuery: (id: string) => {},
    updateQuery: (id: string, data: Omit<ISyntheticSqon, "id">) => {},
    duplicateQuery: (id: string) => {},
    getQueryIndexById: (id: string) => {
      return 0;
    },
    getQueryById: (id: string) => {
      return {} as QueryInstance;
    },
    getQueries: () => {
      return [] as QueryInstance[];
    },
    getActiveQuery: () => {
      return {} as QueryInstance;
    },
    hasQueries: () => {
      return false;
    },
    canCombine: () => true,
  };

  Object.assign(queryBuilder, coreInstance);

  return queryBuilder;
};
