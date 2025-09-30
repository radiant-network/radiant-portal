import { v4 } from 'uuid';

import { SavedFilterType, Sqon } from '@/api/api';

import { ISavedFilter, IUserSavedFilter } from '../saved-filter';
import { BooleanOperators, ISyntheticSqon, TSyntheticSqonContent } from '../sqon';

import { getNewSavedFilter } from './utils/saved-filter';
import { cleanUpQueries, formatQueriesWithPill, getDefaultSyntheticSqon } from './utils/sqon';
import { createQuery, QueryInstance } from './query';
import { createSavedFilter, SavedFilterInstance } from './saved-filter';

export type QueryBuilderState = {
  /**
   * Id of the active query
   */
  activeQueryId: any;

  /**
   * List of queries
   */
  queries: Sqon[];

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
  id: any;

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
   * Sent to User Saved Filter api
   */
  savedFilterType: SavedFilterType;

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
  onQueryUpdate?(query: ISyntheticSqon): void;

  /**
   * Callback when a new query is deleted
   */
  onQueryDelete?(id: any): void;

  /**
   * Callback when a SavedFilter is deleted
   */
  onSavedFilterDelete?(id: any): { savedFilterId: any } | Promise<{ savedFilterId: any }>;

  /**
   * Callback when a SavedFilter is created
   */
  onSavedFilterCreate?(filter: ISavedFilter): void;

  /**
   * Callback when a SavedFilter is saved
   */
  onSavedFilterSave?(filter: ISavedFilter): Promise<IUserSavedFilter>;

  /**
   * Callback when a SavedFilter is updated
   */
  onSavedFilterUpdate?(filter: ISavedFilter): Promise<IUserSavedFilter>;

  /**
   * Callback when a custom pill is saved
   */
  onCustomPillSave?(filter: ISavedFilter): void | Promise<IUserSavedFilter>;

  /**
   * Callback when a custom pill is updated
   */
  onCustomPillUpdate?(filter: ISavedFilter): void | Promise<IUserSavedFilter>;

  /**
   * Callback when a Query is selected
   */
  onQuerySelectChange?(selectedIndexes: number[]): void;

  /**
   * Callback when the active query sqon changes
   */
  onActiveQueryChange?(sqon: ISyntheticSqon): void;

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
  setCoreProps(newCoreProps: (prevCoreProps: CoreQueryBuilderProps) => CoreQueryBuilderProps): void;

  /**
   * Call this function to save the current filter
   */
  saveNewFilter: (params?: Partial<ISavedFilter>) => Promise<void>;

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
  createQuery(input: { id?: string; op: BooleanOperators; content: TSyntheticSqonContent }): string;

  /**
   * Call this function to delete a Query
   */
  deleteQuery(id: string): void;

  /**
   * Call this function to update a Query
   */
  updateQuery(id: string, data: Omit<ISyntheticSqon, 'id'>): void;

  /**
   * Call this function to duplicate a Query
   */
  duplicateQuery(id: string): void;

  /**
   * Call this function to select or unselect a Query
   */
  toggleQuerySelect(id: string, selected: boolean): void;

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
    queries: [getDefaultSyntheticSqon(defaultUUID)] as Sqon[],
    savedFilters: [],
    selectedQueryIndexes: [],
  };
};

export const createQueryBuilder = (coreProps: CoreQueryBuilderProps): QueryBuilderInstance => {
  const queryBuilder: QueryBuilderInstance = {} as QueryBuilderInstance;

  const coreInstance: QueryBuilderInstance = {
    coreProps,
    setCoreProps: updater => {
      queryBuilder.coreProps = updater(queryBuilder.coreProps);
    },
    setState: updater => {
      queryBuilder.coreProps.onStateChange?.(updater(queryBuilder.coreProps.state));
    },
    getState: () => queryBuilder.coreProps.state as QueryBuilderState,
    reset: () => {
      queryBuilder.setState(() => queryBuilder.coreProps.initialState!);
    },
    clearQueries: () => {
      const newActiveId = v4();
      const defaultQuery = getDefaultSyntheticSqon(newActiveId);

      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId: newActiveId,
        queries: [defaultQuery] as Sqon[],
      }));

      queryBuilder.coreProps.onActiveQueryChange?.(defaultQuery);
    },
    saveNewFilter: async filter => {
      const savedFilterToSave: ISavedFilter = {
        id: filter?.id || (v4() as any),
        name: filter?.name || queryBuilder.coreProps.savedFilterDefaultTitle || 'New Filter',
        favorite: filter?.favorite === undefined ? false : filter.favorite,
        queries: filter?.queries || (queryBuilder.getRawQueries() as Sqon[]),
        type: filter?.type || queryBuilder.coreProps.savedFilterType,
      };

      return Promise.resolve(
        queryBuilder.coreProps.onSavedFilterSave?.({
          ...savedFilterToSave,
          queries: formatQueriesWithPill(savedFilterToSave.queries as ISyntheticSqon[]) as Sqon[],
        }),
      ).then(newSavedFilter => {
        if (!newSavedFilter) return;

        queryBuilder.setState(prev => {
          // Remove the saved filter to save from the list of saved filters
          // ID can change when saving a filter, we need to remove the old one and add the new one
          const savedFiltersFiltered = prev.savedFilters.filter(filter => filter.id !== savedFilterToSave.id);

          return {
            ...prev,
            savedFilters: [
              ...savedFiltersFiltered,
              {
                ...newSavedFilter,
                isNew: false,
                isDirty: false,
              },
            ],
          };
        });
      });
    },
    createSavedFilter: () => {
      const { newActiveQueryId, newSavedFilter } = getNewSavedFilter({
        type: queryBuilder.coreProps.savedFilterType,
        defaultTitle: queryBuilder.coreProps.savedFilterDefaultTitle,
      });

      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId: newActiveQueryId,
        queries: newSavedFilter.queries,
        savedFilters: [...prev.savedFilters, newSavedFilter],
      }));

      queryBuilder.coreProps.onSavedFilterCreate?.(newSavedFilter);
    },
    getSelectedSavedFilter: () => {
      const activeQuery = queryBuilder.getActiveQuery();

      if (!activeQuery) {
        return null;
      }

      let selectedSavedFilter = queryBuilder
        .getSavedFilters()
        .find(savedFilter => savedFilter.isSelected() && !savedFilter.isNew());

      if (!selectedSavedFilter) {
        selectedSavedFilter = queryBuilder.getSavedFilters().find(savedFilter => savedFilter.isNew());
      }

      return selectedSavedFilter || null;
    },
    getSavedFilters: () => {
      if (queryBuilder.coreProps.state.savedFilters && queryBuilder.coreProps.state.savedFilters.length > 0) {
        const savedFilters = queryBuilder.coreProps.state.savedFilters.map(savedFilter =>
          createSavedFilter(savedFilter, queryBuilder),
        );

        return savedFilters;
      }

      return [];
    },
    getQueries: () => {
      if (queryBuilder.coreProps.state.queries && queryBuilder.coreProps.state.queries.length > 0) {
        return queryBuilder.coreProps.state.queries.map(query => createQuery(query as ISyntheticSqon, queryBuilder));
      }

      return [];
    },
    getRawQueries: () => (queryBuilder.coreProps.state.queries as ISyntheticSqon[]) || [],
    getSelectedQueryIndexes: () => queryBuilder.getState().selectedQueryIndexes,
    toggleQuerySelect: (id, selected) => {
      queryBuilder.getQuery(id)?.toggleSelect(selected);
    },
    resetQuerySelection: () => {
      queryBuilder.setState(prev => ({
        ...prev,
        selectedQueryIndexes: [],
      }));
      queryBuilder.coreProps.onQuerySelectChange?.([]);
    },
    createQuery: ({ id = v4(), op = BooleanOperators.And, content }) => {
      const newQuery: ISyntheticSqon = { id, op, content };

      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId: newQuery.id,
        queries: cleanUpQueries([...queryBuilder.getRawQueries(), newQuery]) as Sqon[],
      }));

      queryBuilder.coreProps.onActiveQueryChange?.(newQuery);
      queryBuilder.coreProps.onQueryCreate?.(newQuery);

      return newQuery.id;
    },
    getQuery: id => queryBuilder.getQueries().find(query => query.id === id) || null,
    setActiveQuery: id => {
      queryBuilder.getQuery(id)?.setAsActive();
    },
    getActiveQuery: () => {
      if (!queryBuilder.coreProps.state.activeQueryId) {
        return null;
      }

      return queryBuilder.getQuery(queryBuilder.coreProps.state.activeQueryId);
    },
    getQueryIndex: id => {
      const query = queryBuilder.getQuery(id);

      return query ? query.index() : -1;
    },
    updateQuery: (id, updatedQuery) => {
      queryBuilder.getQuery(id)?.update(updatedQuery);
    },
    duplicateQuery: id => {
      queryBuilder.getQuery(id)?.duplicate();
    },
    deleteQuery: id => {
      queryBuilder.getQuery(id)?.delete();
    },
    changeQueryCombineOperator: (id, operator) => {
      queryBuilder.getQuery(id)?.changeCombineOperator(operator);
    },
    hasEmptyQuery: () => queryBuilder.getQueries().some(query => query.isEmpty()),
    hasQueries: () => queryBuilder.getQueries().length > 0,
    canCombine: () => queryBuilder.getQueries().length > 1 && queryBuilder.getSelectedQueryIndexes().length > 1,
    resetQueries: activeQueryId => {
      const newActiveQuery = getDefaultSyntheticSqon(activeQueryId);

      queryBuilder.coreProps.onActiveQueryChange?.(newActiveQuery);

      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId,
        queries: [newActiveQuery] as Sqon[],
      }));
    },
    combineSelectedQueries: (operator: BooleanOperators) => {
      if (!queryBuilder.canCombine()) {
        console.error('Cannot combine queries. There must be at least 2 queries selected.');
        return;
      }

      const combinedQuery: ISyntheticSqon = {
        id: v4(),
        op: operator,
        content: queryBuilder.getSelectedQueryIndexes().sort(),
      };
      const selectedQueryIndexes: number[] = [];

      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId: combinedQuery.id,
        queries: cleanUpQueries([...prev.queries, combinedQuery] as ISyntheticSqon[]) as Sqon[],
        selectedQueryIndexes,
      }));
      queryBuilder.coreProps.onActiveQueryChange?.(combinedQuery);
      queryBuilder.coreProps.onQueryCreate?.(combinedQuery);
      queryBuilder.coreProps.onQuerySelectChange?.(selectedQueryIndexes);
    },
    isEmpty: () => queryBuilder.getQueries().length === 1 && queryBuilder.getQueries()[0].isEmpty(),
  };

  Object.assign(queryBuilder, coreInstance);

  return queryBuilder;
};
