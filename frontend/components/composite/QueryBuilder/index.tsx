import React, { useCallback, useEffect, useState } from "react";
import {
  defaultReferenceColors,
  IQueriesState,
  IQueryBuilderProps,
} from "./types";
import {
  defaultCustomPillConfig,
  defaultFacetFilterConfig,
  defaultHeaderConfig,
  QueryBuilderContext,
  QueryCommonContext,
} from "./context";
import useQueryBuilderState, {
  setQueryBuilderState,
} from "./utils/useQueryBuilderState";
import { v4 } from "uuid";
import cloneDeep from "lodash/cloneDeep";
import { ISyntheticSqon, TSyntheticSqonContent } from "../../utils/sqon/types";
import {
  isQueryStateEqual,
  removeIgnoreFieldFromQueryContent,
} from "./utils/helper";
import {
  getDefaultSyntheticSqon,
  isEmptySqon,
  isNotEmptySqon,
  removeSqonAtIndex,
} from "../../utils/sqon/utils";
import { BooleanOperators } from "../../utils/sqon/operators";
import { cn } from "@/lib/utils";

import styles from "./index.module.css";

const removeIgnoreFieldFromQueryList = (
  sqon: ISyntheticSqon[],
  filterQueryToIgnore?: string[]
) => {
  const queries = cloneDeep(sqon);
  const newQuery: ISyntheticSqon[] = [];
  queries.map((q) =>
    newQuery.push(removeIgnoreFieldFromQueryContent(q, filterQueryToIgnore))
  );
  return newQuery;
};

const QueryBuilder = ({
  id = "",
  className = "",
  dictionary = {},
  currentQuery = {},
  fetchQueryCount,
  total = 0,
  iconTotal = null,
  enableCombine = false,
  enableSingleQuery = false,
  enableShowHideLabels = false,
  initialShowLabelState = true,
  filterQueryToIgnore,
  remoteComponentMapping,
  getResolvedQueryForCount,
  headerConfig = defaultHeaderConfig,
  referenceColors = defaultReferenceColors,
  customPillConfig = defaultCustomPillConfig,
  facetFilterConfig = defaultFacetFilterConfig,
}: IQueryBuilderProps) => {
  const [showLabels, setShowLabels] = useState(initialShowLabelState);
  const [selectedQueryIndices, setSelectedQueryIndices] = useState<number[]>(
    []
  );

  const { state: queryBuilderState } = useQueryBuilderState(id);
  const [queriesState, setQueriesState] = useState<IQueriesState>({
    activeId: queryBuilderState?.active || v4(),
    queries: queryBuilderState?.state || [],
  });

  const [selectedSavedFilter, setSelectedSavedFilter] = useState(
    headerConfig?.selectedSavedFilter || null
  );

  const queryStateQueriesWithoutFilter = removeIgnoreFieldFromQueryList(
    queriesState.queries,
    filterQueryToIgnore
  );

  const emptyQueries = queryStateQueriesWithoutFilter.filter((sqon) =>
    isEmptySqon(sqon)
  );
  const hasEmptyQuery = emptyQueries.length >= 1;

  const noQueries =
    queryStateQueriesWithoutFilter.length === emptyQueries.length;

  const queryCount =
    queryStateQueriesWithoutFilter.length - emptyQueries.length;

  const canCombine =
    queryStateQueriesWithoutFilter.filter((sqon) => isNotEmptySqon(sqon))
      .length >= 2 && selectedQueryIndices.length >= 2;

  const getQueryIndexById = (id: string) =>
    queryStateQueriesWithoutFilter.findIndex((obj) => obj.id === id);

  const currentActiveSqonIndex = getQueryIndexById(queriesState.activeId);

  const selectedSyntheticSqon =
    queryStateQueriesWithoutFilter[currentActiveSqonIndex];

  const getColorForReference = useCallback(
    (refIndex: number) => referenceColors[refIndex % referenceColors.length],
    []
  );

  const isEmpty = (d: any) => true;

  const updateQueryById = (id: string, newQuery: ISyntheticSqon) => {
    if (!id) return;
    if (isEmpty(newQuery.content)) {
      deleteQueryAndSetNext(id);
    } else {
      const currentQueryIndex = getQueryIndexById(id);
      const updatedQueries = cloneDeep(queryStateQueriesWithoutFilter);
      updatedQueries[currentQueryIndex] = {
        ...newQuery,
        content: newQuery.content,
        op: newQuery.op,
      };
      setQueriesState({
        ...queriesState,
        queries: cleanUpQueries(updatedQueries),
      });
    }
  };

  const deleteQueryAndSetNext = (id: string) => {
    if (queryStateQueriesWithoutFilter.length === 1) {
      resetQueries(id);
    } else {
      const currentQueryIndex = getQueryIndexById(id);
      const updatedQueries = cleanUpQueries(
        removeSqonAtIndex(currentQueryIndex, queryStateQueriesWithoutFilter)
      );

      if (updatedQueries.length) {
        const nextSelectedIndex = findNextSelectedQuery(
          updatedQueries,
          currentQueryIndex
        );
        const nextQuery = updatedQueries[nextSelectedIndex];
        const nextID = nextQuery.id;

        if (selectedQueryIndices.includes(currentQueryIndex)) {
          setSelectedQueryIndices(
            selectedQueryIndices.filter(
              (index: number) => index !== currentQueryIndex
            )
          );
        }
        setQueriesState({
          activeId: nextID || "",
          queries: updatedQueries,
        });
      } else {
        resetQueries(id);
      }
    }
  };

  const findNextSelectedQuery = (
    queries: ISyntheticSqon[],
    currentQueryIndex: number
  ) => {
    if (queries.length - 1 >= currentQueryIndex) {
      return currentQueryIndex;
    }

    if (currentQueryIndex + 1 > queries.length - 1) {
      if (
        currentQueryIndex - 1 < queries.length &&
        currentQueryIndex - 1 >= 0
      ) {
        return currentQueryIndex - 1;
      } else {
        return queries.length - 1;
      }
    }

    return currentQueryIndex + 1;
  };

  const resetQueries = (id: string) =>
    setQueriesState({
      activeId: id,
      queries: [getDefaultSyntheticSqon(id)],
    });

  const addNewQuery = (
    id: string = v4(),
    op: BooleanOperators = BooleanOperators.and,
    content: TSyntheticSqonContent = []
  ) =>
    setQueriesState({
      activeId: id,
      queries: cleanUpQueries(
        cloneDeep([
          ...queryStateQueriesWithoutFilter,
          { content: content, id: id, op: op },
        ])
      ),
    });

  const cleanUpQueries = (tmpQuery: ISyntheticSqon[]) => {
    let newQueries = tmpQuery;
    const currentEmptyQueries = tmpQuery.filter((obj) => isEmptySqon(obj));
    const fullQueries = tmpQuery.filter((obj) => isNotEmptySqon(obj));
    if (currentEmptyQueries.length) {
      const emptyQuery = currentEmptyQueries[0];
      newQueries = cloneDeep([...fullQueries, emptyQuery]);
    }
    return newQueries;
  };

  const onCombineClick = (operator: BooleanOperators) => {
    addNewQuery(v4(), operator, selectedQueryIndices.sort());
    setSelectedQueryIndices([]);
  };

  const showQueryTools = () =>
    !noQueries &&
    ((!enableSingleQuery && !canCombine) ||
      (enableCombine && canCombine) ||
      (enableShowHideLabels && !canCombine) ||
      (!canCombine && queryCount > 1));

  useEffect(() => {
    if (
      isEmpty(queryStateQueriesWithoutFilter) &&
      isEmptySqon(currentQuery) &&
      total === 0 &&
      !headerConfig.savedFilters?.length
    ) {
      addNewQuery();
    }
  }, []);

  useEffect(() => {
    if (selectedSavedFilter && (selectedSavedFilter.queries?.length ?? 0) > 0) {
      const activeQuery = selectedSavedFilter.queries.find(
        ({ id }) => id === queryBuilderState?.active
      );
      const activeId = activeQuery?.id ?? selectedSavedFilter.queries[0].id;

      setQueriesState({
        activeId: activeId || "",
        queries: selectedSavedFilter.queries,
      });
    }
  }, [JSON.stringify(selectedSavedFilter)]);

  useEffect(() => {
    if (headerConfig?.selectedSavedFilter) {
      setSelectedSavedFilter(headerConfig.selectedSavedFilter);
    }
  }, [JSON.stringify(headerConfig?.selectedSavedFilter)]);

  useEffect(() => {
    if (isEmptySqon(currentQuery) && total === 0) return;

    if (queryStateQueriesWithoutFilter.length === 0) {
      setQueriesState({
        ...queriesState,
        queries: [
          {
            content: currentQuery.content,
            id: queriesState.activeId,
            op: currentQuery.op,
          },
        ],
      });
    } else {
      const index = queryStateQueriesWithoutFilter.findIndex(
        (obj) => obj.id == queriesState.activeId
      );
      const current = queryStateQueriesWithoutFilter[index];

      if (
        current.content &&
        current.content.length > 0 &&
        isEmpty(currentQuery)
      ) {
        deleteQueryAndSetNext(queriesState.activeId);
      } else {
        const tmpQuery = queryStateQueriesWithoutFilter.map((obj) => {
          // Ensure there is always a op and content
          if (obj.id === queriesState.activeId) {
            return {
              ...obj,
              content: currentQuery.content ? currentQuery.content : [],
              op: obj.op || BooleanOperators.and,
            };
          }
          return {
            ...obj,
            content: obj.content ? obj.content : [],
            op: obj.op || BooleanOperators.and,
          };
        });

        setQueriesState({
          ...queriesState,
          queries: cleanUpQueries(tmpQuery),
        });
      }
    }
  }, [JSON.stringify(currentQuery)]);

  useEffect(() => {
    if (queryBuilderState) {
      if (!isQueryStateEqual(queryBuilderState, queriesState)) {
        setQueriesState({
          activeId: queryBuilderState?.active ?? "",
          queries: queryBuilderState.state ?? [],
        });
      }
    }
  }, [JSON.stringify(queryBuilderState)]);

  useEffect(() => {
    if (queryBuilderState) {
      if (!isQueryStateEqual(queryBuilderState, queriesState)) {
        setQueryBuilderState(id, {
          active: queriesState.activeId,
          state: queryStateQueriesWithoutFilter,
        });
      }
    }
  }, [JSON.stringify(queriesState)]);

  return <div className={cn(styles.queryBuilder, className)}>QueryBuilder</div>;
};

export default QueryBuilder;
