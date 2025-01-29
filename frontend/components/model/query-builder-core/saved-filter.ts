import { ISyntheticSqon } from "../sqon";
import { createQuery, QueryInstance } from "./query";
import { ISavedFilter } from "../saved-filter";
import { QueryBuilderInstance } from "./query-builder";

export type CoreSavedFilter = {
  /**
   * Id of the SavedFilter
   */
  id: string;

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
   * Call this function to check if the SavedFilter is new meaning it has never been saved.
   */
  isNew(): boolean;

  /**
   * Call this function to check if the SavedFilter is dirty meaning it has been modified.
   */
  isDirty(): boolean;
};

export type SavedFilterInstance = CoreSavedFilter;

export const createSavedFilter = (
  queryBuilder: QueryBuilderInstance,
  savedFilter: ISavedFilter
): SavedFilterInstance => {
  const _savedFilter: SavedFilterInstance = {} as SavedFilterInstance;

  const coreInstance: CoreSavedFilter = {
    id: savedFilter.id,
    getQueries: (): QueryInstance[] => {
      if (savedFilter.queries && savedFilter.queries.length > 0) {
        return savedFilter.queries.map((query) =>
          createQuery(queryBuilder, query)
        );
      }

      return [];
    },
    getRawQueries: (): ISyntheticSqon[] => savedFilter.queries,
    getQueryById: (id: string): QueryInstance | null => {
      return _savedFilter.getQueries().find((query) => query.id === id) || null;
    },
    hasQueries: (): boolean => _savedFilter.getQueries().length > 0,
    isNew: (): boolean => false,
    isDirty: (): boolean => false,
  };

  Object.assign(_savedFilter, coreInstance);

  return _savedFilter;
};
