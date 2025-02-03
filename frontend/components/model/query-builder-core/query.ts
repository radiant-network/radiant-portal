import isEmpty from "lodash/isEmpty";
import {
  BooleanOperators,
  ISyntheticSqon,
  IValueFilter,
  IValueQuery,
  TSyntheticSqonContentValue,
} from "../sqon";
import { QueryBuilderInstance } from "./query-builder";
import {
  changeCombineOperatorForQuery,
  cleanUpQueries,
  deleteQueryAndSetNext,
  isEmptySqon,
} from "./utils/sqon";
import cloneDeep from "lodash/cloneDeep";

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
   * Call this function to know if the Query is active
   */
  isActive(): void;

  /**
   * Call this function to set the Query as active
   */
  setAsActive(): void;

  /**
   * Call this function to add pill to the Query
   */
  addPill: (pill: IValueQuery) => void;

  /**
   * Call this function to remove pill from the Query
   */
  removePill: (pillId: string) => void;

  /**
   * Call this function to set the Query as active
   */
  changeCombineOperator(operator: BooleanOperators): void;
};

export type QueryInstance = CoreQuery;

export const createQuery = (
  syntheticSqon: ISyntheticSqon,
  queryBuilder: QueryBuilderInstance
): QueryInstance => {
  const query: QueryInstance = {} as QueryInstance;
  const queryId = syntheticSqon.id;

  const coreInstance: CoreQuery = {
    id: queryId,
    raw: () => syntheticSqon,
    index: () => {
      return queryBuilder
        .getQueries()
        .findIndex((query) => query.id === queryId);
    },
    isActive: () => {
      return queryBuilder.getState().activeQueryId === queryId;
    },
    isEmpty: (): boolean => isEmptySqon(syntheticSqon),
    select: () => {
      const queryIndex = queryBuilder.getQueryIndex(queryId);
      const newSelectedQueryIndexes = [
        ...queryBuilder.getState().selectedQueryIndexes,
        queryIndex,
      ];
      queryBuilder.setState((prev) => ({
        ...prev,
        selectedQueryIndexes: newSelectedQueryIndexes,
      }));
      queryBuilder.coreProps.onQuerySelectChange?.(newSelectedQueryIndexes);
    },
    unselect: () => {
      const queryIndex = queryBuilder.getQueryIndex(queryId);
      const newSelectedQueryIndexes = queryBuilder
        .getState()
        .selectedQueryIndexes.filter((index) => index !== queryIndex);
      queryBuilder.setState((prev) => ({
        ...prev,
        selectedQueryIndexes: newSelectedQueryIndexes,
      }));
      queryBuilder.coreProps.onQuerySelectChange?.(newSelectedQueryIndexes);
    },
    delete: () => {
      deleteQueryAndSetNext(queryId, queryBuilder);
      queryBuilder.coreProps.onQueryDelete?.(queryId);
    },
    update: (data) => {
      if (isEmpty(data.content)) {
        deleteQueryAndSetNext(queryId, queryBuilder);
      } else {
        const currentQueryIndex = queryBuilder.getQueryIndex(queryId);
        const updatedQueries = cloneDeep(queryBuilder.getRawQueries());
        const newQuery: ISyntheticSqon = {
          ...data,
          id: queryId,
          content: data.content,
          op: data.op,
        };
        updatedQueries[currentQueryIndex] = newQuery;

        queryBuilder.setRawQueries(
          queryBuilder.coreProps.state.activeQueryId,
          cleanUpQueries(updatedQueries)
        );
        queryBuilder.coreProps.onQueryUpdate?.(queryId, newQuery);
      }
    },
    duplicate: () => {
      const query = queryBuilder.getQuery(queryId);

      if (query) {
        queryBuilder.createQuery({
          op: query.raw().op as BooleanOperators,
          content: query.raw().content,
        });
      }
    },
    setAsActive: () => {
      queryBuilder.setState((prev) => ({
        ...prev,
        activeQueryId: queryId,
      }));
    },
    changeCombineOperator: (operator) => {
      const clonedQueries = cloneDeep(queryBuilder.getRawQueries());
      const currentQueryIndex = queryBuilder.getQueryIndex(queryId);
      const currentQuery = clonedQueries[currentQueryIndex];
      const updatedQuery = changeCombineOperatorForQuery(
        operator,
        currentQuery
      );

      clonedQueries[currentQueryIndex] = {
        ...currentQuery,
        content: updatedQuery.content,
        op: updatedQuery.op,
      };

      queryBuilder.setState((prev) => ({
        ...prev,
        queries: cleanUpQueries(clonedQueries),
      }));
    },
    addPill: (pill) => {
      queryBuilder.updateQuery(syntheticSqon.id, {
        ...syntheticSqon,
        content: [...syntheticSqon.content, pill],
      });
    },
    removePill: (pillId) => {
      queryBuilder.updateQuery(syntheticSqon.id, {
        ...syntheticSqon,
        content: syntheticSqon.content
          .map((sqonContent: TSyntheticSqonContentValue) => {
            if ((sqonContent as IValueFilter).id !== pillId) return sqonContent;
          })
          .filter((el) => el !== undefined),
      });
    },
  };

  Object.assign(query, coreInstance);

  return query;
};
