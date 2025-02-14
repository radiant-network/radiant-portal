import { ISyntheticSqon } from "../sqon";
import { createQuery, QueryInstance } from "./query";
import { ISavedFilter } from "../saved-filter";
import { QueryBuilderInstance } from "./query-builder";
import { v4 } from "uuid";
import { getNewSavedFilter } from "./utils/saved-filter";
import isEqual from "lodash/isEqual";
import { formatQueriesWithPill } from "./utils/sqon";

export type CoreSavedFilter = {
  /**
   * Id of the SavedFilter
   */
  id: string;

  /**
   * Call this function to get the SavedFilter's raw data
   */
  raw(): ISavedFilter;

  /**
   * Call this function to get the SavedFilter's queries
   */
  getQueries(): QueryInstance[];

  /**
   * Call this function to get the SavedFilter's raw queries (ISyntheticSqon[])
   */
  getRawQueries(): ISyntheticSqon[];

  /**
   * Call this function to get a Query by id
   *
   * @param id Query id
   */
  getQueryById(id: string): QueryInstance | null;

  /**
   * Call this function to check if the SavedFilter has queries
   */
  hasQueries(): boolean;

  /**
   * Call this function to delete the SavedFilter
   */
  delete(): void;

  /**
   * Call this function to update the SavedFilter
   */
  update(data: Partial<Pick<ISavedFilter, "favorite" | "title">>): void;

  /**
   * Call this function to duplicate the SavedFilter
   */
  duplicate(): void;

  /**
   * Call this function to save the SavedFilter
   */
  save(): void;

  /**
   * Call this function to discard the changes made to the SavedFilter
   */
  discardChanges(): void;

  /**
   * Call this function to set the SavedFilter title
   */
  setTile(title: string): void;

  /**
   * Call this function to select the SavedFilter
   */
  select(): void;

  /**
   * Call this function to set the SavedFilter as favorite
   */
  toggleFavorite(): void;

  /**
   * Call this function to check if the SavedFilter is a favorite
   */
  isFavorite(): boolean;

  /**
   * Call this function to check if the SavedFilter is new meaning it has never been saved.
   */
  isNew(): boolean;

  /**
   * Call this function to check if the SavedFilter is dirty meaning it has been modified.
   */
  isDirty(): boolean;

  /**
   * Call this function to check if the SavedFilter is currently selected
   */
  isSelected(): boolean;
};

export type SavedFilterInstance = CoreSavedFilter;

export const createSavedFilter = (
  rawSavedFilter: ISavedFilter,
  queryBuilder: QueryBuilderInstance
): SavedFilterInstance => {
  const _savedFilter: SavedFilterInstance = {} as SavedFilterInstance;
  const savedFilterId = rawSavedFilter.id;

  const coreInstance: CoreSavedFilter = {
    id: savedFilterId,
    raw: () => rawSavedFilter,
    getQueries: () => {
      if (rawSavedFilter.queries && rawSavedFilter.queries.length > 0) {
        return rawSavedFilter.queries.map((query) =>
          createQuery(query, queryBuilder)
        );
      }

      return [];
    },
    getRawQueries: () => {
      return rawSavedFilter.queries;
    },
    getQueryById: (id) => {
      return _savedFilter.getQueries().find((query) => query.id === id) || null;
    },
    update: (data) => {
      const updatedSavedFilter: ISavedFilter = {
        ...rawSavedFilter,
        ...data,
        isNew: false,
        isDirty: true,
      };

      queryBuilder.setState((prev) => ({
        ...prev,
        savedFilters: prev.savedFilters.map((filter) =>
          filter.id === savedFilterId ? updatedSavedFilter : filter
        ),
      }));

      queryBuilder.coreProps.onSavedFilterSave?.(updatedSavedFilter);
    },
    duplicate: () => {
      if (_savedFilter.isSelected()) {
        const duplicatedQueries: ISyntheticSqon[] = _savedFilter
          .getRawQueries()
          .map((query) => ({
            ...query,
            id: v4(),
          }));

        const duplicatedSavedFilter: ISavedFilter = {
          favorite: false,
          id: v4(),
          queries: duplicatedQueries,
          title: `${_savedFilter.raw().title || ""} COPY`,
          isDirty: false,
          isNew: true,
        };

        queryBuilder.setState((prev) => ({
          ...prev,
          activeQueryId: duplicatedSavedFilter.queries[0].id,
          queries: duplicatedQueries,
          savedFilters: [...prev.savedFilters, duplicatedSavedFilter],
        }));

        queryBuilder.coreProps.onSavedFilterCreate?.(duplicatedSavedFilter);
      } else {
        console.error("Can only duplicate the selected saved filter");
      }
    },
    delete: () => {
      queryBuilder.coreProps.onSavedFilterDelete?.(savedFilterId);

      if (_savedFilter.isSelected()) {
        const { newActiveQueryId, newSavedFilter } = getNewSavedFilter();

        queryBuilder.setState((prev) => ({
          ...prev,
          activeQueryId: newActiveQueryId,
          queries: newSavedFilter.queries,
          savedFilters: [
            ...prev.savedFilters.filter(
              (filter) => filter.id !== savedFilterId
            ),
            newSavedFilter,
          ],
        }));

        queryBuilder.coreProps.onSavedFilterCreate?.(newSavedFilter);
      }
    },
    save: () => {
      if (_savedFilter.isSelected()) {
        const savedFilterToSave: ISavedFilter = {
          ..._savedFilter.raw(),
          queries: formatQueriesWithPill(queryBuilder.getRawQueries()),
        };

        queryBuilder.coreProps.onSavedFilterSave?.(savedFilterToSave);

        queryBuilder.setState((prev) => ({
          ...prev,
          savedFilters: prev.savedFilters.map((filter) =>
            filter.id === savedFilterId
              ? {
                  ...savedFilterToSave,
                  isNew: false,
                  isDirty: false,
                }
              : filter
          ),
        }));
      } else {
        console.error("Can only save the selected saved filter");
      }
    },
    select: () => {
      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId: rawSavedFilter.queries[0].id,
        queries: rawSavedFilter.queries,
      }));
    },
    discardChanges: () => {
      if (_savedFilter.isSelected()) {
        queryBuilder.setState((prev) => ({
          ...prev,
          activeQueryId: rawSavedFilter.queries[0].id,
          queries: rawSavedFilter.queries,
        }));
      } else {
        console.error("Can only discard changes to the selected saved filter");
      }
    },
    setTile: (title) => {
      _savedFilter.update({ title });
    },
    toggleFavorite: () => {
      queryBuilder.coreProps.onSavedFilterFavoriteChange?.(
        savedFilterId,
        !rawSavedFilter.favorite
      );
    },
    hasQueries: () => _savedFilter.getQueries().length > 0,
    isSelected: () => {
      const currentQueryIds = queryBuilder.getState().queries.map((q) => q.id);
      /**
       * Compare against queryBuilder queries to ensure that the saved filter is selected
       */
      return (
        rawSavedFilter.queries.find((query) =>
          currentQueryIds.includes(query.id)
        ) !== undefined
      );
    },
    isFavorite: () => {
      return rawSavedFilter.favorite || false;
    },
    isNew: () => {
      if (!_savedFilter.isSelected()) {
        return false;
      }

      return rawSavedFilter.isNew || false;
    },
    isDirty: () => {
      if (!_savedFilter.isSelected() || rawSavedFilter.isNew) {
        return false;
      }

      if (rawSavedFilter.isDirty) {
        return true;
      }

      /**
       * Deliberately compare queryBuilder raw queries with rawSavedFilter queries
       * Since queryBuilder raw queries are always up to date and rawSavedFilter queries
       * update only when the saved filter is saved.
       */
      if (
        queryBuilder.getRawQueries().length !== rawSavedFilter.queries.length
      ) {
        return true;
      }

      return !rawSavedFilter.queries.every((savedFilterQuery) => {
        const foundQuery = queryBuilder
          .getRawQueries()
          .find((query) => query.id == savedFilterQuery.id);

        return foundQuery
          ? isEqual(
              {
                content: foundQuery.content,
                id: foundQuery.id,
                op: foundQuery.op,
              },
              {
                content: savedFilterQuery.content,
                id: savedFilterQuery.id,
                op: savedFilterQuery.op,
              }
            )
          : false;
      });
    },
  };

  Object.assign(_savedFilter, coreInstance);

  return _savedFilter;
};
