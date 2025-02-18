import isEmpty from "lodash/isEmpty";
import {
  BooleanOperators,
  ISyntheticSqon,
  IValueQuery,
  TSyntheticSqonContentValue,
} from "../sqon";
import { QueryBuilderInstance } from "./query-builder";
import {
  changeCombineOperatorForQuery,
  cleanUpQueries,
  deleteQueryAndSetNext,
  isEmptySqon,
  isIndexReferencedInSqon,
  removeContentFromSqon,
  removeQueryFromSqon,
} from "./utils/sqon";
import cloneDeep from "lodash/cloneDeep";
import { ISavedFilter, SavedFilterTypeEnum } from "../saved-filter";
import { v4 } from "uuid";

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
   */
  isEmpty(): boolean;

  /**
   * Call this function to know if the Query is empty
   */
  isNotEmpty(): boolean;

  /**
   * Call this function to delete the Query
   */
  delete(): void;

  /**
   * Call this function to update the Query
   */
  update(data: Omit<ISyntheticSqon, "id">): void;

  /**
   * Call this function to save the Query as a custom pill
   */
  saveAsCustomPill(title: string): void | Promise<void>;

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
   * Call this function to know if the Query is selected
   */
  isSelected(): boolean;

  /**
   * Call this function to know if the Query is selectable,
   * meaning the query can be selected for a combine operation
   */
  isSelectable(): boolean;

  /**
   * Call this function to know if the Query is active
   */
  isActive(): boolean;

  /**
   * Call this function to set the Query as active
   */
  setAsActive(): void;

  /**
   * Call this function to add pill to the Query
   */
  addPill: (pill: IValueQuery) => void;

  /**
   * Call this function to remove pill from the Query by ID
   */
  removePillById: (pillId: string) => void;

  /**
   * Call this function to remove pill from the Query by field name
   */
  removePillByFieldOrIndex: (indexOfField: string | number) => void;

  /**
   * Call this function to set the Query as active
   */
  changeCombineOperator(operator: BooleanOperators): void;

  /**
   * Call this function to know if the Query is referenced in the active query
   */
  isReferencedInActiveQuery(): boolean;

  /**
   * Call this function to know if the Query has a custom pill
   */
  hasCustomPill(): boolean;
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
        .getState()
        .queries.findIndex((query) => query.id === queryId);
    },
    isActive: () => {
      return queryBuilder.getState().activeQueryId === queryId;
    },
    isEmpty: (): boolean => isEmptySqon(syntheticSqon),
    isNotEmpty: (): boolean => !isEmptySqon(syntheticSqon),
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
    isSelected: () => {
      return queryBuilder
        .getState()
        .selectedQueryIndexes.includes(queryBuilder.getQueryIndex(queryId));
    },
    isSelectable: () => {
      const queries = queryBuilder.getState().queries;

      if (queries.length === 2 && queryBuilder.hasEmptyQuery()) {
        return false;
      }

      return queries.length > 1 && query.isNotEmpty();
    },
    saveAsCustomPill: async (title) => {
      const customPill: ISavedFilter = {
        favorite: false,
        id: v4(),
        queries: [query.raw()],
        title,
        type: SavedFilterTypeEnum.Query,
      };

      return Promise.resolve(
        queryBuilder.coreProps.onCustomPillSave?.(customPill)
      ).then(() =>
        query.update({
          ...query.raw(),
          content: [
            {
              id: customPill.id,
              op: customPill.queries[0].op,
              content: customPill.queries[0].content,
              title: customPill.title,
            },
          ],
        })
      );
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

        queryBuilder.setState((prev) => ({
          ...prev,
          queries: cleanUpQueries(updatedQueries),
        }));
        queryBuilder.coreProps.onQueryUpdate?.(newQuery);
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
      queryBuilder.coreProps.onActiveQueryChange?.(query.raw());
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
      query.update({
        ...syntheticSqon,
        content: [...syntheticSqon.content, pill],
      });
    },
    removePillById: (pillId) => {
      query.update(removeQueryFromSqon(pillId, syntheticSqon));
    },
    removePillByFieldOrIndex: (indexOrField) => {
      query.update(removeContentFromSqon(indexOrField, syntheticSqon));
    },
    isReferencedInActiveQuery: () => {
      const activeQuery = queryBuilder.getActiveQuery();

      if (activeQuery) {
        return isIndexReferencedInSqon(query.index(), activeQuery.raw());
      }

      return false;
    },
    hasCustomPill: () => {
      return query
        .raw()
        .content.some(
          (queryPart: TSyntheticSqonContentValue) =>
            (queryPart as IValueQuery).title ||
            !(queryPart as IValueQuery).content
        );
    },
  };

  Object.assign(query, coreInstance);

  return query;
};
