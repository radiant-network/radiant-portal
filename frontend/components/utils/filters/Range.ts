import {
  IFilter,
  IFilterGroup,
  IFilterRange,
  IRangeAggs,
} from "@/composite/Filters/types";
import { RangeOperators } from "@/utils/sqon/operators";
import {
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueContent,
  IValueFilter,
} from "@/utils/sqon/types";
import { isBooleanOperator, isReference } from "@/utils/sqon/utils";

export const getSelectedFiltersForRange = (
  filters: IFilter[],
  filterGroup: IFilterGroup,
  selectedFilters: ISyntheticSqon
): IFilter[] => {
  const rangeData = getRangeSelection(selectedFilters, filterGroup);
  return filters.map((f) => ({ ...f, data: rangeData }));
};

const hasValueMissing = (content: IValueContent) => {
  // TODO check how to validate this since no more arranger values
  return false;
};

export const getRangeSelection = (
  filters: ISyntheticSqon,
  filterGroup: IFilterGroup
): IFilterRange => {
  let rangeSelection: IFilterRange = {
    max: undefined,
    min: undefined,
    operator: filterGroup.config?.defaultOperator
      ? RangeOperators[filterGroup.config?.defaultOperator as RangeOperators]
      : RangeOperators["<"],
    rangeType: undefined,
  };
  for (const filter of filters.content) {
    let noDataSelected = false;
    let filt = filter as IValueFilter;
    const filterAsSqonGroupfilter = filter as ISqonGroupFilter;

    if (isReference(filter)) continue;

    if (
      isBooleanOperator(filter) &&
      filterAsSqonGroupfilter.content.some(({ content }) =>
        hasValueMissing(content as IValueContent)
      )
    ) {
      noDataSelected = true;
      filt = filterAsSqonGroupfilter.content.find(
        ({ content }) => !hasValueMissing(content as IValueContent)
      ) as IValueFilter;
    }

    if (filt.content.field !== filterGroup.field) {
      continue;
    }

    switch (filt.op) {
      case RangeOperators.between:
        rangeSelection = {
          ...rangeSelection,
          max: filt.content.value[1] as number,
          min: filt.content.value[0] as number,
          noDataSelected,
          operator: RangeOperators.between,
        };
        break;
      case RangeOperators["<"]:
      case RangeOperators["<="]:
        rangeSelection = {
          ...rangeSelection,
          max: filt.content.value[0] as number,
          noDataSelected,
          operator: RangeOperators[filt.op],
        };
        break;
      case RangeOperators[">"]:
      case RangeOperators[">="]:
        rangeSelection = {
          ...rangeSelection,
          min: filt.content.value[0] as number,
          noDataSelected,
          operator: RangeOperators[filt.op],
        };
        break;
      case RangeOperators["in"]:
        rangeSelection = {
          ...rangeSelection,
          noDataSelected: true,
          operator: RangeOperators[filt.op],
        };
        break;
    }
  }

  return rangeSelection;
};

export const isRangeAgg = (obj: IRangeAggs) => !!obj.stats;
