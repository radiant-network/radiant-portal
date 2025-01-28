import { ISyntheticSqon } from "../../../../model/sqon";
import { QueryBuilderInstance } from "./query-builder";
import { isEmptySqon } from "./utils/sqon";

export type CoreQuery = {
  /**
   * ID of the Query
   */
  id: string;

  /**
   * SyntheticSqon representing the query
   */
  syntheticSqon: ISyntheticSqon;

  /**
   * Call this function to know if the Query is empty
   *
   * @returns boolean
   */
  isEmpty: () => boolean;

  /**
   * Call this function to delete the Query
   */
  delete(): void;

  /**
   * Call this function to update the Query
   *
   * @param data ISyntheticSqon
   */
  update(data: Omit<ISyntheticSqon, "id">): void;

  /**
   * Call this function to duplicate the Query
   */
  duplicate(): void;
};

export type QueryInstance = CoreQuery;

export const createQuery = (
  queryBuilder: QueryBuilderInstance,
  syntheticSqon: ISyntheticSqon
): QueryInstance => {
  const query: QueryInstance = {} as QueryInstance;

  const coreInstance: CoreQuery = {
    id: syntheticSqon.id,
    syntheticSqon,
    isEmpty: (): boolean => isEmptySqon(syntheticSqon),
    delete: () => queryBuilder.deleteQuery(query.id),
    update: (data) => queryBuilder.updateQuery(query.id, data),
    duplicate: () => queryBuilder.duplicateQuery(query.id),
  };

  Object.assign(query, coreInstance);

  return query;
};
