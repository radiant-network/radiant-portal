import { ISyntheticSqon } from "../sqon";
import { createQuery, QueryInstance } from "./query";
import { ISavedFilter, SavedFilterTypeEnum } from "../saved-filter";
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
   */
  getQueryById(id: string): QueryInstance | null;

  /**
   * Call this function to check if the SavedFilter has queries
   */
  hasQueries(): boolean;

  /**
   * Call this function to delete the SavedFilter
   */
  delete(): void | Promise<void>;

  /**
   * Call this function to duplicate the SavedFilter
   */
  duplicate(): void;

  /**
   * Call this function to save (update) the SavedFilter
   */
  save(
    type: SavedFilterTypeEnum,
    params?: {
      title?: string;
      favorite?: boolean;
    }
  ): Promise<void>;

  /**
   * Call this function to discard the changes made to the SavedFilter
   */
  discardChanges(): void;

  /**
   * Call this function to select the SavedFilter
   */
  select(): void;

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
    delete: async () => {
      return Promise.resolve(
        queryBuilder.coreProps.onSavedFilterDelete?.(savedFilterId)
      ).then(() => {
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
      });
    },
    save: async (type, params) => {
      const savedFilterToSave: ISavedFilter = {
        ..._savedFilter.raw(),
        title: params?.title || _savedFilter.raw().title,
        favorite:
          params?.favorite !== undefined
            ? params.favorite
            : _savedFilter.raw().favorite,
        type,
        queries: queryBuilder.getRawQueries(),
      };

      const asCustomPill = type === SavedFilterTypeEnum.Query;

      if (asCustomPill) {
        return Promise.resolve(
          queryBuilder.coreProps.onCustomPillUpdate?.(savedFilterToSave)
        ).then(() => {});
      } else {
        return Promise.resolve(
          queryBuilder.coreProps.onSavedFilterUpdate?.({
            ...savedFilterToSave,
            queries: formatQueriesWithPill(savedFilterToSave.queries),
          })
        ).then(() =>
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
          }))
        );
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
