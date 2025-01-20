import { IFilter, IFilterGroup, IFilterRange, IRangeAggs } from '../../components/filters/types';
import { ArrangerValues } from '../arranger/formatting';
import { RangeOperators } from '../sqon/operators';
import { ISqonGroupFilter, ISyntheticSqon, IValueContent, IValueFilter } from '../sqon/types';
import { isBooleanOperator, isReference } from '../sqon/utils';

export const getSelectedFiltersForRange = (
    filters: IFilter[],
    filterGroup: IFilterGroup,
    selectedFilters: ISyntheticSqon,
): IFilter[] => {
    const rangeData = getRangeSelection(selectedFilters, filterGroup);
    return filters.map((f) => ({ ...f, data: rangeData }));
};

const hasValueMissing = (content: IValueContent) => content.value.includes(ArrangerValues.missing);

export const getRangeSelection = (filters: ISyntheticSqon, filterGroup: IFilterGroup): IFilterRange => {
    let rangeSelection: IFilterRange = {
        max: undefined,
        min: undefined,
        operator: filterGroup.config?.defaultOperator
            ? RangeOperators[filterGroup.config?.defaultOperator as RangeOperators]
            : RangeOperators['<'],
        rangeType: undefined,
    };
    for (const filter of filters.content) {
        let noDataSelected = false;
        let filt = filter as IValueFilter;
        const filterAsSqonGroupfilter = filter as ISqonGroupFilter;

        if (isReference(filter)) continue;

        if (
            isBooleanOperator(filter) &&
            filterAsSqonGroupfilter.content.some(({ content }) => hasValueMissing(content as IValueContent))
        ) {
            noDataSelected = true;
            filt = filterAsSqonGroupfilter.content.find(
                ({ content }) => !hasValueMissing(content as IValueContent),
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
            case RangeOperators['<']:
            case RangeOperators['<=']:
                rangeSelection = {
                    ...rangeSelection,
                    max: filt.content.value[0] as number,
                    noDataSelected,
                    operator: RangeOperators[filt.op],
                };
                break;
            case RangeOperators['>']:
            case RangeOperators['>=']:
                rangeSelection = {
                    ...rangeSelection,
                    min: filt.content.value[0] as number,
                    noDataSelected,
                    operator: RangeOperators[filt.op],
                };
                break;
            case RangeOperators['in']:
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
