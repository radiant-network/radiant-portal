import { ISyntheticSqon } from "../sqon";
import { QueryInstance } from "./query";
import { ISavedFilter } from "../saved-filter";

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
  savedFilter: ISavedFilter
): SavedFilterInstance => {
  return {
    id: savedFilter.id,
    getQueries: (): QueryInstance[] => [],
    getRawQueries: (): ISyntheticSqon[] => savedFilter.queries,
    getQueryById: (id: string): QueryInstance | null => null,
    hasQueries: (): boolean => false,
    isNew: (): boolean => false,
    isDirty: (): boolean => false,
  };
};
