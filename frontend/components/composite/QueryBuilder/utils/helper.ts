import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import {
  ISyntheticSqon,
  IValueContent,
  IValueFilter,
} from "../../../utils/sqon/types";
import { IQueriesState, IQueryBuilderState } from "../types";

const removeTotal = (sqonList: ISyntheticSqon[]) =>
  sqonList.map((query) => {
    const { total, ...syntheticSqon } = query;
    return syntheticSqon;
  });

export const isQueryStateEqual = (
  queryBuilderState: IQueryBuilderState,
  queriesState: IQueriesState
): boolean => {
  const cleanedQueriesState: IQueryBuilderState = {
    active: queriesState.activeId,
    state: removeTotal(cloneDeep(queriesState.queries)),
  };
  const cleanedQueryBuilderState: IQueryBuilderState = {
    ...queryBuilderState,
    state: removeTotal(cloneDeep(queryBuilderState.state ?? [])),
  };

  return isEqual(cleanedQueryBuilderState, cleanedQueriesState);
};

export const removeIgnoreFieldFromQueryContent = (
  query: ISyntheticSqon,
  filterQueryToIgnore?: string[]
): ISyntheticSqon => {
  const queryToRemove = query.content.filter((c) => {
    let toKeep = false;
    if (!Array.isArray((c as IValueFilter).content)) {
      if ((c as IValueFilter).content) {
        if (
          !filterQueryToIgnore?.includes(
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
          !filterQueryToIgnore?.includes(
            ((c as IValueFilter).content as IValueContent).field
          )
        ) {
          toKeep = true;
        }
        if (Array.isArray((c as IValueFilter).content)) {
          const { field } = (
            (c as IValueFilter).content as unknown as IValueFilter[]
          )[0].content as IValueContent;
          if (filterQueryToIgnore?.includes(field)) {
            toKeep = false;
          }
        }
      }
    }

    return toKeep;
  });
  return {
    content: queryToRemove,
    id: query.id,
    op: query.op,
  };
};
