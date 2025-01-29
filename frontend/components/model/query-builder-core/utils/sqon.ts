import {
  BooleanOperators,
  FieldOperators,
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueContent,
  IValueFilter,
  RangeOperators,
  SET_ID_PREFIX,
  TSqonContentValue,
  TSyntheticSqonContent,
  TSyntheticSqonContentValue,
} from "../../sqon";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import { QueryBuilderInstance } from "../query-builder";
import { v4 } from "uuid";

/**
 * Check if a synthetic sqon is empty.
 *
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon to check
 */
export const isEmptySqon = (
  sqon: ISyntheticSqon | Record<string, never>
): boolean => !Object.keys(sqon).length || isEmpty(sqon?.content);

export const isNotEmptySqon = (
  sqon: ISyntheticSqon | Record<string, never> | TSyntheticSqonContentValue
): boolean => !isEmptySqon(sqon as ISyntheticSqon);

/**
 * Check if a synthetic sqon is a reference to another sqon.
 *
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon to check
 */
export const isReference = (
  sqon: ISyntheticSqon | Record<string, never> | TSyntheticSqonContentValue
): boolean => !isNotReference(sqon);

export const isNotReference = (sqon: any): boolean => isNaN(sqon);

/**
 * Check if a sqon value is a set.
 *
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon to check
 */
export const isSet = (value: IValueFilter): boolean =>
  value.content.value &&
  value.content.value.some((value) =>
    value?.toString().startsWith(SET_ID_PREFIX)
  );

export const isNotSet = (value: IValueFilter): boolean => !isSet(value);

/**
 * Check if a sqon value is an uploaded list.
 *
 * @param {IValueFilter} value The value to check
 */
export const isUploadedList = (value: IValueFilter): boolean =>
  Boolean(value.content.isUploadedList);

/**
 *
 * @param value Check if a sqon value is a treefacet
 * @returns
 */
export const isRemoteComponent = (value: IValueFilter): boolean =>
  !!value.content.remoteComponent;

/**
 * Check if a synthetic sqon is a boolean operator
 * Operator is either one of the following: 'or', 'and' or 'not'
 *
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon to check
 */
export const isBooleanOperator = (
  sqon: ISyntheticSqon | Record<string, never> | TSyntheticSqonContentValue
): boolean =>
  typeof sqon === "object" &&
  isNotEmptySqon(sqon) &&
  "op" in sqon &&
  sqon.op in BooleanOperators;

/**
 * Check if a synthetic sqon is a field operator
 * Operator is either one of the following: '>', '<', 'between', '>=','<=', 'in', 'not-in' or 'all'
 *
 * @param {ISyntheticSqon} sqon The synthetic sqon to check
 */
export const isFieldOperator = (
  sqon: ISyntheticSqon | Record<string, never> | ISqonGroupFilter
): boolean =>
  typeof sqon === "object" && isNotEmptySqon(sqon) && sqon.op in FieldOperators;

/**
 * Check if a query filter is a boolean one.
 *
 * @param {IValueFilter} query
 */
export const isBooleanFilter = (query: IValueFilter): boolean =>
  query.content.value.every((val) =>
    ["false", "true"].includes(val.toString().toLowerCase())
  );

/**
 * Check if a query filter is a range one.
 *
 * @param {IValueFilter} query
 */
export const isRangeFilter = (query: IValueFilter): boolean =>
  query.op === RangeOperators.in ? false : query.op in RangeOperators;

/**
 * Check if a query filter is a custom pill.
 *
 * @param {IValueFilter} query
 */
export const isCustomPill = (query: IValueFilter): boolean => !!query.title;

/**
 * Generates an empty synthetic sqon
 *
 * @param {ISyntheticSqon} syntheticSqon The empty synthetic sqon
 */
export const generateEmptyQuery = (
  sqon: ISyntheticSqon = { content: [], id: v4(), op: BooleanOperators.and }
): ISyntheticSqon => ({
  ...sqon,
  content: [],
});

export const getDefaultSyntheticSqon = (id: string = v4()): ISyntheticSqon => ({
  content: [],
  id,
  op: BooleanOperators.and,
});

export const removeIgnoredFieldsFromQueryList = (
  sqon: ISyntheticSqon[],
  fieldsToIgnore: string[] = []
) => {
  const queries = cloneDeep(sqon);
  const newQuery: ISyntheticSqon[] = [];
  queries.map((q) => {
    newQuery.push(removeIgnoredFieldsFromQueryContent(q, fieldsToIgnore));
  });
  return newQuery;
};

export const removeIgnoredFieldsFromQueryContent = (
  query: ISyntheticSqon,
  fieldsToIgnore?: string[]
): ISyntheticSqon => {
  const filteredQuery = query.content.filter((c) => {
    let toKeep = false;
    if (!Array.isArray((c as IValueFilter).content)) {
      if ((c as IValueFilter).content) {
        if (
          !fieldsToIgnore?.includes(
            ((c as IValueFilter).content as IValueContent).field
          )
        ) {
          toKeep = true;
        }
      } else {
        toKeep = true;
      }
    } else {
      if (
        ((c as IValueFilter).content as unknown as IValueContent[]).length !== 0
      ) {
        if (
          !fieldsToIgnore?.includes(
            ((c as IValueFilter).content as IValueContent).field
          )
        ) {
          toKeep = true;
        }
        if (Array.isArray((c as IValueFilter).content)) {
          const { field } = (
            (c as IValueFilter).content as unknown as IValueFilter[]
          )[0].content as IValueContent;
          if (fieldsToIgnore?.includes(field)) {
            toKeep = false;
          }
        }
      }
    }

    return toKeep;
  });

  return {
    content: filteredQuery,
    id: query.id,
    op: query.op,
  };
};

export const cleanUpQueries = (queries: ISyntheticSqon[]) => {
  let newQueries = queries;
  const currentEmptyQueries = queries.filter((obj) => isEmptySqon(obj));
  const fullQueries = queries.filter((obj) => isNotEmptySqon(obj));
  if (currentEmptyQueries.length) {
    const emptyQuery = currentEmptyQueries[0];
    newQueries = cloneDeep([...fullQueries, emptyQuery]);
  }
  return newQueries;
};

/**
 * Remove recursively a sqon using its index.
 *
 * @param {number} indexToRemove Index of the synthetic sqon to remove
 * @param {Array<ISyntheticSqon>} sqonsList All synthetic sqons in the query builder
 *
 * @returns {Array<ISyntheticSqon>} The new synthetic sqons list
 */
export const removeSqonAtIndex = (
  indexToRemove: number,
  sqonsList: ISyntheticSqon[]
): Array<ISyntheticSqon> => {
  const getNewContent = (
    indexToRemove: number,
    content: TSyntheticSqonContent
  ) =>
    content
      .filter(
        (content: TSyntheticSqonContentValue | TSqonContentValue) =>
          content !== indexToRemove
      )
      .map((s: TSyntheticSqonContentValue | TSqonContentValue) =>
        isReference(s)
          ? typeof s === "number" && s > indexToRemove
            ? (s as number) - 1
            : s
          : s
      );

  const result = sqonsList
    .filter((s, i) => i !== indexToRemove)
    .map((sqon) => {
      if (isEmptySqon(sqon)) {
        return sqon;
      }

      return {
        ...sqon,
        content: getNewContent(indexToRemove, sqon.content),
      };
    });

  const emptyQueries = result.filter((s) => isEmpty(s.content));

  if (emptyQueries.length) {
    return removeSqonAtIndex(
      result.findIndex((s) => s.id == emptyQueries[0].id),
      result
    );
  }

  return result;
};

export const deleteQueryAndSetNext = (
  queryId: string,
  queryBuilder: QueryBuilderInstance
) => {
  const queries = queryBuilder.getRawQueries();

  if (queries.length === 1) {
    queryBuilder.resetQueries(queryId);
  } else {
    const queryIndex = queryBuilder.getQueryIndexById(queryId);
    const updatedQueries = cleanUpQueries(
      removeSqonAtIndex(queryIndex, queries)
    );

    if (updatedQueries.length) {
      const nextSelectedIndex = findNextSelectedQuery(
        updatedQueries,
        queryIndex
      );
      const nextQuery = updatedQueries[nextSelectedIndex];
      const nextID = nextQuery.id;

      // TODO I think this is to handle combined queries
      // if (selectedQueryIndices.includes(currentQueryIndex)) {
      //   setSelectedQueryIndices(
      //     selectedQueryIndices.filter(
      //       (index: number) => index !== currentQueryIndex
      //     )
      //   );
      // }

      queryBuilder.setQueries(nextID, updatedQueries);
    } else {
      queryBuilder.resetQueries(queryId);
    }
  }
};

export const findNextSelectedQuery = (
  queries: ISyntheticSqon[],
  queryIndex: number
) => {
  if (queries.length - 1 >= queryIndex) {
    return queryIndex;
  }

  if (queryIndex + 1 > queries.length - 1) {
    if (queryIndex - 1 < queries.length && queryIndex - 1 >= 0) {
      return queryIndex - 1;
    } else {
      return queries.length - 1;
    }
  }

  return queryIndex + 1;
};
