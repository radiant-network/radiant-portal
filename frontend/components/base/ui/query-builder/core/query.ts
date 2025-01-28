import { ISyntheticSqon } from "../../../../model/sqon";
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
};

export type QueryInstance = CoreQuery;

export const createQuery = (syntheticSqon: ISyntheticSqon): QueryInstance => {
  return {
    id: syntheticSqon.id,
    syntheticSqon,
    isEmpty: (): boolean => isEmptySqon(syntheticSqon),
  };
};
