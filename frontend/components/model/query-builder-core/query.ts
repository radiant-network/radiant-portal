import isEmpty from 'lodash/isEmpty';
import {
  BooleanOperators,
  ISyntheticSqon,
  IValueQuery,
  TSqonContent,
  TSqonGroupOp,
  TSyntheticSqonContent,
  TSyntheticSqonContentValue,
} from '../sqon';
import { QueryBuilderInstance } from './query-builder';
import {
  changeCombineOperatorForQuery,
  cleanUpQueries,
  deleteQueryAndSetNext,
  isEmptySqon,
  isIndexReferencedInSqon,
  removeContentFromSqon,
  removeQueryFromSqon,
} from './utils/sqon';
import cloneDeep from 'lodash/cloneDeep';
import { ISavedFilter, SavedFilterTypeEnum } from '../saved-filter';
import { v4 } from 'uuid';
import { Sqon } from '@/api/api';

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
  update(data: Omit<ISyntheticSqon, 'id'>): void;

  /**
   * Call this function to save the Query as a custom pill
   */
  saveAsCustomPill(name: string): void | Promise<void>;

  /**
   * Call this function to duplicate the Query
   */
  duplicate(): void;

  /**
   * Call this function to get the index of the Query
   */
  index(): number;

  /**
   * Call this function to select or unselect the Query
   */
  toggleSelect(selected: boolean): void;

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

export const createQuery = (syntheticSqon: ISyntheticSqon, queryBuilder: QueryBuilderInstance): QueryInstance => {
  const query: QueryInstance = {} as QueryInstance;
  const queryId = syntheticSqon.id ?? v4();

  const coreInstance: CoreQuery = {
    id: queryId,
    raw: () => syntheticSqon,
    index: () => queryBuilder.getState().queries.findIndex(query => query.id === queryId),
    isActive: () => queryBuilder.getState().activeQueryId === queryId,
    isEmpty: (): boolean => isEmptySqon(syntheticSqon),
    isNotEmpty: (): boolean => !isEmptySqon(syntheticSqon),
    toggleSelect: selected => {
      const queryIndex = queryBuilder.getQueryIndex(queryId);
      let selectedQueryIndexes: number[] = [];

      if (selected) {
        selectedQueryIndexes = [...queryBuilder.getState().selectedQueryIndexes, queryIndex];
      } else {
        selectedQueryIndexes = queryBuilder.getState().selectedQueryIndexes.filter(index => index !== queryIndex);
      }

      queryBuilder.setState(prev => ({
        ...prev,
        selectedQueryIndexes,
      }));
      queryBuilder.coreProps.onQuerySelectChange?.(selectedQueryIndexes);
    },
    isSelected: () => {
      return queryBuilder.getState().selectedQueryIndexes.includes(queryBuilder.getQueryIndex(queryId));
    },
    isSelectable: () => {
      const queries = queryBuilder.getState().queries;

      if (queries.length === 2 && queryBuilder.hasEmptyQuery()) {
        return false;
      }

      return queries.length > 1 && query.isNotEmpty();
    },
    saveAsCustomPill: async name => {
      const customPill: ISavedFilter = {
        favorite: false,
        id: v4() as any,
        queries: [query.raw()] as Sqon[],
        name,
        type: queryBuilder.coreProps.savedFilterType,
      };

      return Promise.resolve(queryBuilder.coreProps.onCustomPillSave?.(customPill)).then(() =>
        query.update({
          ...query.raw(),
          content: [
            {
              id: customPill.id,
              op: customPill.queries[0].op as TSqonGroupOp,
              content: customPill.queries[0].content as TSqonContent,
              title: customPill.name,
            },
          ],
        }),
      );
    },
    delete: () => {
      deleteQueryAndSetNext(queryId, queryBuilder);
      queryBuilder.coreProps.onQueryDelete?.(queryId);
    },
    update: data => {
      if (isEmpty(data.content)) {
        deleteQueryAndSetNext(queryId, queryBuilder);
      } else {
        const activeQueryId = queryBuilder.getState().activeQueryId;
        const currentQueryIndex = queryBuilder.getQueryIndex(queryId);
        const updatedQueries = cloneDeep(queryBuilder.getRawQueries());
        const newQuery: ISyntheticSqon = {
          ...data,
          id: queryId,
          content: data.content,
          op: data.op,
        };
        updatedQueries[currentQueryIndex] = newQuery;

        queryBuilder.setState(prev => ({
          ...prev,
          queries: cleanUpQueries(updatedQueries) as Sqon[],
        }));
        queryBuilder.coreProps.onQueryUpdate?.(newQuery);

        if (activeQueryId === queryId) {
          queryBuilder.coreProps.onActiveQueryChange?.(newQuery);
        }
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
      queryBuilder.setState(prev => ({
        ...prev,
        activeQueryId: queryId,
      }));
      queryBuilder.coreProps.onActiveQueryChange?.(query.raw());
    },
    changeCombineOperator: operator => {
      const clonedQueries = cloneDeep(queryBuilder.getRawQueries());
      const currentQueryIndex = queryBuilder.getQueryIndex(queryId);
      const currentQuery = clonedQueries[currentQueryIndex];
      const updatedQuery = changeCombineOperatorForQuery(operator, currentQuery);

      clonedQueries[currentQueryIndex] = {
        ...currentQuery,
        content: updatedQuery.content,
        op: updatedQuery.op,
      };

      queryBuilder.setState(prev => ({
        ...prev,
        queries: cleanUpQueries(clonedQueries) as Sqon[],
      }));

      queryBuilder.coreProps.onActiveQueryChange?.(clonedQueries[currentQueryIndex]);
    },
    addPill: pill => {
      query.update({
        ...syntheticSqon,
        content: [...syntheticSqon.content, pill],
      });
    },
    removePillById: pillId => {
      query.update(removeQueryFromSqon(pillId, syntheticSqon));
    },
    removePillByFieldOrIndex: indexOrField => {
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
            (queryPart as IValueQuery).name || !(queryPart as IValueQuery).content,
        );
    },
  };

  Object.assign(query, coreInstance);

  return query;
};
