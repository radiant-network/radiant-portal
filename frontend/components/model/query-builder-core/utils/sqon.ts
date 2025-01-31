import {
  BooleanOperators,
  FieldOperators,
  FilterOperators,
  IMergeOptions,
  IRemoteComponent,
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueContent,
  IValueFilter,
  IValueQuery,
  IWildCardValueContent,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
  RangeOperators,
  SET_ID_PREFIX,
  TermOperators,
  TSqonContent,
  TSqonContentValue,
  TSqonGroupOp,
  TSyntheticSqonContent,
  TSyntheticSqonContentValue,
} from "../../sqon";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import { QueryBuilderInstance, QueryBuilderState } from "../query-builder";
import { v4 } from "uuid";
import merge from "lodash/merge";
import union from "lodash/union";

/**
 * Check if a synthetic sqon is empty.
 */
export const isEmptySqon = (
  sqon: ISyntheticSqon | Record<string, never>
): boolean => !Object.keys(sqon).length || isEmpty(sqon?.content);

export const isNotEmptySqon = (
  sqon: ISyntheticSqon | Record<string, never> | TSyntheticSqonContentValue
): boolean => !isEmptySqon(sqon as ISyntheticSqon);

/**
 * Check if a synthetic sqon is a reference to another sqon.
 */
export const isReference = (
  sqon: ISyntheticSqon | Record<string, never> | TSyntheticSqonContentValue
): boolean => !isNotReference(sqon);

export const isNotReference = (sqon: any): boolean => isNaN(sqon);

/**
 * Check if a sqon value is a set.
 */
export const isSet = (value: IValueFilter): boolean =>
  value.content.value &&
  value.content.value.some((value) =>
    value?.toString().startsWith(SET_ID_PREFIX)
  );

export const isNotSet = (value: IValueFilter): boolean => !isSet(value);

/**
 * Check if a sqon value is an uploaded list.
 */
export const isUploadedList = (value: IValueFilter): boolean =>
  Boolean(value.content.isUploadedList);

/**
 * Check if a sqon value is a remote component.
 */
export const isRemoteComponent = (value: IValueFilter): boolean =>
  !!value.content.remoteComponent;

/**
 * Check if a synthetic sqon is a boolean operator
 * Operator is either one of the following: 'or', 'and' or 'not'
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
 */
export const isFieldOperator = (
  sqon: ISyntheticSqon | Record<string, never> | ISqonGroupFilter
): boolean =>
  typeof sqon === "object" && isNotEmptySqon(sqon) && sqon.op in FieldOperators;

/**
 * Check if a query filter is a boolean one.
 */
export const isBooleanFilter = (query: IValueFilter): boolean =>
  query.content.value.every((val) =>
    ["false", "true"].includes(val.toString().toLowerCase())
  );

/**
 * Check if a query filter is a range one.
 */
export const isRangeFilter = (query: IValueFilter): boolean =>
  query.op === RangeOperators.in ? false : query.op in RangeOperators;

/**
 * Check if a query filter is a custom pill.
 */
export const isCustomPill = (query: IValueFilter): boolean => !!query.title;

/**
 * Generates an empty synthetic sqon
 */
export const generateEmptyQuery = (
  sqon: ISyntheticSqon = { content: [], id: v4(), op: BooleanOperators.and }
): ISyntheticSqon => ({
  ...sqon,
  content: [],
});

export const getDefaultSyntheticSqon = (id: string = v4()): ISyntheticSqon => ({
  id,
  content: [],
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
    newQueries = [...fullQueries, emptyQuery];
  }
  return cloneDeep(newQueries);
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
    const queryIndex = queryBuilder.getQueryIndex(queryId);
    const updatedQueries = cleanUpQueries(
      removeSqonAtIndex(queryIndex, queries)
    );

    if (updatedQueries.length) {
      const nextSelectedIndex = findNextSelectedQuery(
        updatedQueries,
        queryIndex
      );
      const nextQuery = updatedQueries[nextSelectedIndex];
      let selectedQueryIndexes = queryBuilder.getSelectedQueryIndexes();

      if (selectedQueryIndexes.includes(queryIndex)) {
        selectedQueryIndexes = selectedQueryIndexes
          .filter((index) => index !== queryIndex)
          .map((index) => (index > queryIndex ? index - 1 : index));
        queryBuilder.coreProps.onQuerySelectChange?.(selectedQueryIndexes);
      }

      const newQueryState: QueryBuilderState = {
        activeQueryId: nextQuery.id,
        queries: updatedQueries,
        selectedQueryIndexes,
      };

      queryBuilder.setState((prev) => ({
        ...prev,
        ...newQueryState,
      }));
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

/**
 * Recursively change the operator throughout a given synthetic sqon
 *
 * @param {TSqonGroupOp} operator The new operator
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon to update
 *
 * @returns {ISyntheticSqon} The modified synthetic sqon
 */
export const changeCombineOperatorForQuery = (
  operator: TSqonGroupOp,
  syntheticSqon: ISyntheticSqon
): ISyntheticSqon => ({
  ...syntheticSqon,
  content: syntheticSqon.content.map((subContent: TSyntheticSqonContentValue) =>
    isBooleanOperator(subContent) &&
    !(subContent as ISqonGroupFilter).skipBooleanOperatorCheck
      ? changeCombineOperatorForQuery(operator, subContent as ISyntheticSqon)
      : subContent
  ) as TSyntheticSqonContent,
  op: operator,
});

export const removeFieldFromSqon = (
  field: string,
  sqon: ISyntheticSqon
): ISyntheticSqon => ({
  ...sqon,
  content: sqon.content.filter(function f(sqon: any): boolean {
    if (isReference(sqon)) {
      return true;
    }

    if (isBooleanOperator(sqon)) {
      return (sqon.content as TSqonContent).filter(f).length > 0;
    }

    return !((sqon as IValueFilter).content.field === field);
  }),
});

export const deepMergeFieldInQuery = ({
  query,
  field,
  index,
  isUploadedList,
  merge_strategy = MERGE_VALUES_STRATEGIES.APPEND_VALUES,
  operator = TermOperators.in,
  overrideValuesName,
  remoteComponent,
  value,
}: {
  query: ISyntheticSqon;
  field: string;
  value: Array<string | number | boolean>;
  index?: string;
  merge_strategy?: MERGE_VALUES_STRATEGIES;
  operator?: TermOperators | RangeOperators;
  overrideValuesName?: string;
  isUploadedList?: boolean;
  remoteComponent?: IRemoteComponent;
}): ISyntheticSqon => {
  let newSqon;
  const newSqonContent: IValueFilter = {
    content: {
      field,
      index,
      isUploadedList,
      overrideValuesName,
      remoteComponent,
      value,
    },
    op: operator,
  };

  if (!isEmpty(query)) {
    newSqon = deepMergeSqonValue(query, newSqonContent, {
      operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
      values: merge_strategy,
    });
  } else {
    newSqon = getDefaultSyntheticSqon();
    newSqon.content = [newSqonContent];
  }

  return newSqon;
};

export const deepMergeSqonValue = (
  sourceSqon: ISyntheticSqon,
  newSqon: IValueFilter,
  opts: IMergeOptions
): ISyntheticSqon => {
  const clonedSqons = cloneDeep(sourceSqon);

  opts = merge(
    {},
    {
      operator: MERGE_OPERATOR_STRATEGIES.DEFAULT,
      values: MERGE_VALUES_STRATEGIES.DEFAULT,
    },
    opts
  );

  const found = deeplySetSqonValue(clonedSqons, newSqon, opts);

  return found
    ? clonedSqons
    : {
        ...clonedSqons,
        content: [...clonedSqons.content, newSqon],
      };
};

/**
  * Recursively traverse the `sourceSqon` and mutate the matching field's value and, optionaly, it's operator.

  * @param {Object} sourceSqon - a sqon object to traverse recursively and mutate
  * @param {Object} newSqon - a sqon, that may omit the operator,
  * that provide the field name searched and value to be set
  * @param {Object} opts - options to handle merging the values.
  *
  * @returns `true` if the field was found; `false` otherwise.
  */
const deeplySetSqonValue = (
  sourceSqon: ISyntheticSqon,
  newSqon: IValueFilter,
  opts: IMergeOptions
) => {
  let found = false;

  sourceSqon.content.forEach((sqon) => {
    // dont follow references and custom pill
    if (isReference(sqon)) return;
    if ((sqon as IValueQuery).title) return;

    const castedSqon = sqon as TSqonContentValue;

    // traverse nested sqons recursively
    if (isBooleanOperator(castedSqon)) {
      found = deeplySetSqonValue(castedSqon as ISyntheticSqon, newSqon, opts);
      return;
    }

    const castedValueSqon = castedSqon as IValueFilter;

    // field found, set the value and operator
    if (castedValueSqon.content.field === newSqon.content.field) {
      found = true;

      if (newSqon.content.overrideValuesName) {
        castedValueSqon.content.overrideValuesName =
          newSqon.content.overrideValuesName;
      }

      if (newSqon.op) {
        if (opts.operator !== MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR) {
          castedValueSqon.op = newSqon.op;
        }
      }

      if (opts.values === MERGE_VALUES_STRATEGIES.APPEND_VALUES) {
        castedValueSqon.content.value = union(
          [],
          castedValueSqon.content.value,
          newSqon.content.value
        );
      }

      if (opts.values === MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES) {
        castedValueSqon.content.value = newSqon.content.value;
      }
    }
  });

  return found;
};

export const findSqonValueByField = (
  field: string,
  sqon: ISqonGroupFilter,
  prevValue: any = undefined
): any => {
  let value: any = prevValue;
  sqon.content.forEach((content) => {
    if (isReference(content)) {
      return;
    } else if (isBooleanOperator(content)) {
      value =
        value ||
        findSqonValueByField(field, content as ISqonGroupFilter, prevValue);
    } else {
      const valueContent = content as IValueFilter;

      if (valueContent.content.field === field) {
        value = value || valueContent.content.value;
      }
    }
  });
  return value;
};

export const generateWildCardValueFilter = ({
  fields,
  index = "",
  operator = FilterOperators.filter,
  overrideValuesName,
  value,
}: {
  fields: string[];
  value: string[];
  index?: string;
  operator?: TermOperators | string;
  overrideValuesName?: string;
}): { content: IWildCardValueContent; op: TermOperators | string } => ({
  content: { fields, index, overrideValuesName, value },
  op: operator,
});

/**
 * Remove a value from a given synthetic sqon
 *
 * @param {*} contentToRemove The content/value to remove
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon to update
 *
 * @returns {ISyntheticSqon} The modified synthetic sqon
 */
export const removeContentFromSqon = (
  indexOrField: string | number,
  syntheticSqon: ISyntheticSqon
): ISyntheticSqon => {
  const content = syntheticSqon.content as TSyntheticSqonContent;
  const contentCleaned =
    typeof indexOrField === "number"
      ? content.filter((c) => c !== indexOrField)
      : content.filter((c) => {
          if (typeof c === "number") {
            return true;
          }

          const contentAsSqonGroupFilter = c as ISqonGroupFilter;
          const { skipBooleanOperatorCheck } = contentAsSqonGroupFilter;

          const isValueContentToDelete =
            skipBooleanOperatorCheck &&
            (contentAsSqonGroupFilter.content[0].content as IValueContent)
              .field !== indexOrField;

          const isValueFilterToDelete =
            (c as IValueFilter).content.field !== indexOrField;

          return skipBooleanOperatorCheck
            ? isValueContentToDelete
            : isValueFilterToDelete;
        });

  return {
    ...syntheticSqon,
    content: contentCleaned,
    op: syntheticSqon.op,
  };
};

/**
 * Recursively check if a synthetic sqon index is referenced inside a given synthetic sqon
 *
 * @param {number} indexReference The index of the synthetic sqon to check
 * @param {ISyntheticSqon} syntheticSqon The synthetic sqon from which to verified
 *
 * @returns {boolean} If the index is referenced or not
 */
export const isIndexReferencedInSqon = (
  indexReference: number,
  syntheticSqon: ISyntheticSqon
): boolean =>
  isBooleanOperator(syntheticSqon)
    ? syntheticSqon.content.reduce(
        (acc: boolean, contentSqon: TSyntheticSqonContentValue) =>
          acc ||
          isIndexReferencedInSqon(
            indexReference,
            contentSqon as ISyntheticSqon
          ),
        false
      )
    : typeof syntheticSqon === "number" && syntheticSqon === indexReference;
