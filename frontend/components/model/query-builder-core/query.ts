import { ISyntheticSqon } from "../sqon";
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
  raw(): ISyntheticSqon;

  /**
   * Call this function to know if the Query is empty
   *
   * @returns boolean
   */
  isEmpty(): boolean;

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

  /**
   * Call this function to get the index of the Query
   */
  index(): number;

  /**
   * Call this function to select the Query
   */
  select(): void;

  /**
   * Call this function to unselect the Query
   */
  unselect(): void;

  /**
   * Call this function to set the Query as active
   */
  setAsActive(): void;
};

export type QueryInstance = CoreQuery;

export const createQuery = (
  queryBuilder: QueryBuilderInstance,
  syntheticSqon: ISyntheticSqon
): QueryInstance => {
  const query: QueryInstance = {} as QueryInstance;

  const coreInstance: CoreQuery = {
    id: syntheticSqon.id,
    raw: () => syntheticSqon,
    select: () => queryBuilder.selectQuery(query.id),
    unselect: () => queryBuilder.unselectQuery(query.id),
    index: () => queryBuilder.getQueryIndexById(query.id),
    isEmpty: (): boolean => isEmptySqon(syntheticSqon),
    delete: () => queryBuilder.deleteQuery(query.id),
    update: (data) => queryBuilder.updateQuery(query.id, data),
    duplicate: () => queryBuilder.duplicateQuery(query.id),
    setAsActive: () => queryBuilder.setActiveQuery(query.id),
  };

  Object.assign(query, coreInstance);

  return query;
};
