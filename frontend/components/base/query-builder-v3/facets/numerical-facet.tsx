/**
 * Numerical Facet Component
 *
 * A React component that provides numerical filtering capabilities for data exploration.
 * This component allows users to filter numerical data using various operators and ranges.
 *
 * ## Key Features:
 * - Support for multiple range operators (greater than, less than, between, etc.)
 * - Integration with statistics API for dynamic min/max values
 * - Configurable decimal precision and intervals
 * - Unit selection for range types
 * - "No data" option for missing values
 *
 * ## Interval Decimal:
 * The `intervalDecimal` configuration controls the decimal precision displayed in the filter.
 * - For integer fields (API type 'integer'): defaults to 0 decimal places
 * - For other numerical fields: defaults to 3 decimal places
 * - Can be overridden in the aggregation configuration via `intervalDecimal` property
 *
 * ## Configuration Usage: (aggConfig)
 * The component uses the `IFilterRangeConfig` interface for configuration:
 * ```typescript
 * {
 *   min?: number;                    // Minimum allowed value
 *   max?: number;                    // Maximum allowed value
 *   defaultMin?: number;             // Default minimum value
 *   defaultMax?: number;             // Default maximum value
 *   defaultOperator?: RangeOperators; // Default operator selection
 *   intervalDecimal?: number;        // Decimal precision for display
 *   rangeTypes?: IFilterRangeTypes[]; // Available unit types
 *   noDataInputOption?: boolean;     // Show "no data" checkbox
 * }
 *
 * example in config/radiant.json
 * {
 *   min: 0,
 *   max: 100,
 *   defaultMin: 0,
 *   defaultMax: 100,
 *   defaultOperator: RangeOperators.Between,
 *   intervalDecimal: 0,
 * }
 * ```
 *
 */

import { useCallback, useEffect, useState } from 'react';
import { TFunction } from 'i18next';

import { type Statistics } from '@/api/api';
import ElementOperatorIcon from '@/components/base/icons/element-operator-icon';
import EqualOperatorIcon from '@/components/base/icons/equal-operator-icon';
import GreaterThanOperatorIcon from '@/components/base/icons/greater-than-operator-icon';
import GreaterThanOrEqualOperatorIcon from '@/components/base/icons/greater-than-or-equal-operator-icon';
import LessThanOperatorIcon from '@/components/base/icons/less-than-operator-icon';
import LessThanOrEqualOperatorIcon from '@/components/base/icons/less-than-or-equal-operator-icon';
import { useFacetConfig } from '@/components/base/query-builder-v3/facets/hooks/use-facet-config';
import { Button } from '@/components/base/shadcn/button';
import { CardContent, CardFooter } from '@/components/base/shadcn/card';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { TextMuted } from '@/components/base/typography/text-muted';
import { IFilterRangeConfig } from '@/components/cores/applications-config';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { DEFAULT_EMPTY_QUERY, queryBuilderRemote } from '@/components/cores/query-builder/query-builder-remote';
import i18n, { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBContext, useQBDispatch } from '../hooks/use-query-builder';
import { ISqonGroupFacet, IValueFacet, RangeOperators, TSqonContentValue } from '../type';

const API_DEFAULT_TYPE = 'integer';

/**
 * noData
 * unappliedItems
 */
function getNumericalValue(
  fieldKey: string,
  activeQuery: ISqonGroupFacet,
  aggConfig: IFilterRangeConfig,
  statistics?: Statistics,
) {
  let hasUnappliedItems: boolean = false;
  let selectedRange: RangeOperators = aggConfig?.defaultOperator ?? RangeOperators.LessThan;
  let minValue: string = '0';
  let maxValue: string = '0';
  let numericalValue: string = '';
  let hasNoData: boolean = false;
  const decimal = statistics?.type === API_DEFAULT_TYPE ? 0 : 3;

  // Find the main numeric field filter
  const numericFilter = activeQuery.content.find((x: TSqonContentValue) =>
    'content' in x && 'field' in x.content ? x.content.field === fieldKey : false,
  ) as IValueFacet | undefined;

  // Find the unit field filter if it exists
  const unitFilter = activeQuery.content.find((x: TSqonContentValue) => {
    if ('content' in x && 'field' in x.content) {
      return x.content.field === `${fieldKey}_unit`;
    }
    return false;
  }) as IValueFacet | undefined;

  if (numericFilter) {
    const values = numericFilter.content.value;
    // eslint-disable-next-line no-console
    console.log('[NumericalFilter] values', values);
    // Check for __missing__ value
    if (values.includes('__missing__')) {
      return {
        hasUnappliedItems,
        selectedRange,
        minValue,
        maxValue,
        numericalValue,
        hasNoData: true,
        selectedUnit: undefined,
      };
    }

    hasUnappliedItems = true;

    // Handle numeric values
    if (values.length === 2) {
      selectedRange = RangeOperators.Between;
      minValue = Number(Number(values[0]).toFixed(decimal)).toLocaleString(i18n.language);
      maxValue = Number(Number(values[1]).toFixed(decimal)).toLocaleString(i18n.language);
    } else {
      // Single value case
      numericalValue = Number(values[0]).toLocaleString(i18n.language);
    }

    if (numericFilter.op) {
      selectedRange = numericFilter.op as RangeOperators;
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('[NumericalFilter else] no filter exists', aggConfig);

    hasNoData = false;

    // Use defaults from config if available
    if (aggConfig?.defaultMin !== undefined) {
      minValue = aggConfig.defaultMin.toLocaleString(i18n.language);
      numericalValue = aggConfig.defaultMin.toLocaleString(i18n.language);
    } else if (statistics?.min !== undefined) {
      minValue = Number(statistics.min.toFixed(decimal)).toLocaleString(i18n.language);
      numericalValue = Number(statistics.min.toFixed(decimal)).toLocaleString(i18n.language);
    }

    if (aggConfig?.defaultMax !== undefined) {
      maxValue = aggConfig.defaultMax.toLocaleString(i18n.language);
    } else if (statistics?.max !== undefined) {
      maxValue = Number(statistics.max.toFixed(decimal)).toLocaleString(i18n.language);
    }

    if (aggConfig?.defaultOperator) {
      selectedRange = RangeOperators[aggConfig.defaultOperator as keyof typeof RangeOperators];
    }
  }

  let selectedUnit = undefined;
  if (unitFilter && (unitFilter.content.value[0] as string) && aggConfig?.rangeTypes?.length) {
    selectedUnit = aggConfig.rangeTypes[0].key;
  }

  return {
    hasUnappliedItems,
    selectedRange,
    minValue,
    maxValue,
    numericalValue,
    hasNoData,
    selectedUnit,
  };
}

type RangeOperatorLabelProps = {
  display: string;
  dropdown: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

function getRangeOperatorLabels(t: TFunction<string, undefined>): Record<RangeOperators, RangeOperatorLabelProps> {
  return {
    [RangeOperators.GreaterThan]: {
      display: t('common.filters.operators.greater_than'),
      dropdown: t('common.filters.operators.greater_than'),
      icon: GreaterThanOperatorIcon,
    },
    [RangeOperators.LessThan]: {
      display: t('common.filters.operators.less_than'),
      dropdown: t('common.filters.operators.less_than'),
      icon: LessThanOperatorIcon,
    },
    [RangeOperators.Between]: {
      display: t('common.filters.operators.between'),
      dropdown: t('common.filters.operators.between'),
      icon: ElementOperatorIcon,
    },
    [RangeOperators.GreaterThanOrEqualTo]: {
      display: t('common.filters.operators.greater_than_or_equal'),
      dropdown: t('common.filters.operators.greater_than_or_equal'),
      icon: GreaterThanOrEqualOperatorIcon,
    },
    [RangeOperators.LessThanOrEqualTo]: {
      display: t('common.filters.operators.less_than_or_equal'),
      dropdown: t('common.filters.operators.less_than_or_equal'),
      icon: LessThanOrEqualOperatorIcon,
    },
    [RangeOperators.In]: {
      display: t('common.filters.operators.in'),
      dropdown: t('common.filters.operators.in'),
      icon: EqualOperatorIcon,
    },
  };
}

interface IProps {
  field: AggregationConfig;
}

// eslint-disable-next-line complexity
export function NumericalFacet({ field }: IProps) {
  const { t } = useI18n();
  const dispatch = useQBDispatch();
  const { aggregations } = useQBContext();
  const { appId } = useFacetConfig();
  const { statisticFetcher } = useFacetConfig();
  const fieldKey = field.key;
  const RANGE_OPERATOR_LABELS = getRangeOperatorLabels(t);

  // Fetch statistics for min/max values
  const { data: statistics, isLoading: isLoadingStats } = statisticFetcher({ field: fieldKey });
  const decimal = statistics?.type === API_DEFAULT_TYPE ? 0 : 3;
  const [selectedRange, setSelectedRange] = useState<RangeOperators>(RangeOperators.GreaterThan);
  const [numericValue, setNumericValue] = useState<string>('0');
  const [maxValue, setMaxValue] = useState<string>('0');
  const [minValue, setMinValue] = useState<string>('0');
  const [hasNoData, setHasNoData] = useState<boolean>(false);
  // Initialize selectedUnit as undefined rather than defaulting to any value
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>();

  const [hasUnappliedItems, setHasUnappliedItems] = useState(false);

  const aggConfig = Object.values(aggregations)
    .flatMap(f => f.items)
    .find(agg => agg.key === fieldKey)?.defaults as IFilterRangeConfig;
  const noDataInputOption = field.type === 'numerical' && aggConfig?.noDataInputOption;
  const hasInterval =
    (aggConfig?.intervalDecimal !== undefined && (aggConfig?.max !== undefined || aggConfig?.min !== undefined)) ||
    (statistics && (statistics.min !== undefined || statistics.max !== undefined));

  // Determine min/max values with precedence: aggConfig first, then statistics
  const inputMin = aggConfig?.min ?? statistics?.min ?? 0;
  const inputMax = aggConfig?.max ?? statistics?.max ?? 100;

  const initializeForm = useCallback(() => {
    const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);
    if (!activeQuery?.content) return;

    const result = getNumericalValue(fieldKey, activeQuery, aggConfig, statistics);
    setHasNoData(result.hasNoData);
    setMinValue(result.minValue);
    setMaxValue(result.maxValue);
    setHasUnappliedItems(result.hasUnappliedItems);
    setSelectedRange(result.selectedRange ?? RangeOperators.GreaterThan);
    setNumericValue(result.numericalValue);
  }, [appId, fieldKey, aggConfig, statistics]);

  // Update min/max values when statistics are loaded
  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const onRangeValueChanged = useCallback((value: string) => {
    setSelectedRange(value as RangeOperators);
    setHasUnappliedItems(true);
  }, []);

  const onNoDataChanged = useCallback((checked: boolean) => {
    setHasNoData(checked);
    setHasUnappliedItems(true);
  }, []);

  const onRangeTypeChanged = useCallback((value: string) => {
    setSelectedUnit(value);
    setHasUnappliedItems(true);
  }, []);

  const reset = () => {
    setHasUnappliedItems(false);
    const result = getNumericalValue(fieldKey, DEFAULT_EMPTY_QUERY, aggConfig, statistics);
    setHasNoData(result.hasNoData);
    setMinValue(result.minValue);
    setMaxValue(result.maxValue);
    setHasUnappliedItems(result.hasUnappliedItems);
    setSelectedRange(result.selectedRange);
    setNumericValue(result.numericalValue);
  };

  const apply = useCallback(() => {
    setHasUnappliedItems(false);

    // Handle no data case
    if (hasNoData) {
      // @TODO: change action-flag type
      dispatch({
        type: QBActionType.ADD_MULTISELECT_VALUE,
        payload: {
          field: fieldKey,
          value: ['__missing__'],
        },
      });
      return;
    }

    // Handle numeric values
    let values: number[] = [];
    values =
      selectedRange === RangeOperators.Between
        ? [parseFloat(minValue.toString()), parseFloat(maxValue.toString())]
        : [parseFloat(numericValue.toString())];

    // Update the main field with numeric values
    // @TODO: change action-flag type
    dispatch({
      type: QBActionType.ADD_MULTISELECT_VALUE,
      payload: {
        field: fieldKey,
        value: values,
        operator: selectedRange,
      },
    });

    // If a unit is selected, update the unit field
    if (selectedUnit) {
      // @TODO: change action-flag type
      dispatch({
        type: QBActionType.ADD_MULTISELECT_VALUE,
        payload: {
          field: `${fieldKey}_unit`,
          value: [selectedUnit],
        },
      });
    }
  }, [appId, fieldKey, selectedRange, numericValue, minValue, maxValue, hasNoData, selectedUnit]);

  const RangeChoices = Object.entries(RangeOperators)
    .map(([_key, op]) => {
      if (op in RANGE_OPERATOR_LABELS) {
        const Icon = RANGE_OPERATOR_LABELS[op as RangeOperators].icon;
        return (
          <SelectItem key={op} value={op}>
            <div className="flex items-center gap-2">
              <Icon size={16} />
              <span>{RANGE_OPERATOR_LABELS[op as RangeOperators].dropdown}</span>
            </div>
          </SelectItem>
        );
      }
      return null;
    })
    .filter(Boolean);

  return (
    <>
      <CardContent id={`${fieldKey}_container`} size="sm" variant="outline">
        <div className="pt-2">
          <div className="flex flex-col gap-3">
            <div id={`${fieldKey}_operator`}>
              <Select value={selectedRange} onValueChange={onRangeValueChanged}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder={t('common.filters.operators.select_operator')}>
                    {RANGE_OPERATOR_LABELS[selectedRange]?.display || t('common.filters.operators.unknown')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>{RangeChoices}</SelectContent>
              </Select>
            </div>

            {selectedRange === RangeOperators.Between ? (
              <div className="flex gap-2 flex-row">
                <Input
                  size="xs"
                  className="w-half"
                  value={minValue}
                  onChange={e => {
                    const value = e.target.value;
                    if (isNaN(Number(value))) return;
                    setMinValue(value);
                    setHasUnappliedItems(true);
                  }}
                  min={inputMin}
                  max={inputMax}
                  id={`${fieldKey}_min`}
                  data-testid={`${fieldKey}_min`}
                />
                <Input
                  size="xs"
                  className="w-half"
                  value={maxValue}
                  onChange={e => {
                    const value = e.target.value;
                    if (isNaN(Number(value))) return;
                    setMaxValue(value);
                    setHasUnappliedItems(true);
                  }}
                  min={inputMin}
                  max={inputMax}
                  id={`${fieldKey}_max`}
                  data-testid={`${fieldKey}_max`}
                />
              </div>
            ) : (
              <Input
                size="xs"
                className="w-full"
                value={numericValue}
                onChange={e => {
                  const value = e.target.value;
                  if (isNaN(Number(value))) return;
                  setNumericValue(value);
                  setHasUnappliedItems(true);
                }}
                min={inputMin}
                max={inputMax}
                id={`${fieldKey}_value`}
                data-testid={`${fieldKey}_value`}
              />
            )}

            {hasInterval && (
              <div id={`${fieldKey}_interval`}>
                <TextMuted size="xs">
                  {t('common.filters.labels.actual_interval')} : {statistics?.min?.toFixed(decimal)} -{' '}
                  {statistics?.min !== undefined
                    ? Number(statistics.min.toFixed(decimal)).toLocaleString(i18n.language)
                    : ''}{' '}
                  -{' '}
                  {statistics?.max !== undefined
                    ? Number(statistics.max.toFixed(decimal)).toLocaleString(i18n.language)
                    : ''}
                </TextMuted>
              </div>
            )}
          </div>

          {aggConfig?.rangeTypes && aggConfig.rangeTypes.length > 0 && (
            <div id={`${fieldKey}_range_type_container`} className="mt-3">
              {isLoadingStats ? (
                <>
                  <Skeleton className="h-5 w-16 mb-1" id={`${fieldKey}_unit_label_skeleton`} />
                  <Skeleton className="h-9 w-full" id={`${fieldKey}_select_skeleton`} />
                </>
              ) : (
                <>
                  <Label className="text-sm" id={`${fieldKey}_unit_label`}>
                    {t('common.filters.labels.unit')}
                  </Label>
                  <Select defaultValue={selectedUnit || aggConfig.rangeTypes[0].key} onValueChange={onRangeTypeChanged}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.filters.labels.select_unit')}>
                        {aggConfig.rangeTypes.find(type => type.key === selectedUnit)?.name ||
                          t('common.filters.labels.select_unit')}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {aggConfig.rangeTypes.map(type => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          )}

          {noDataInputOption && !hasInterval && (
            <label className="flex items-center space-x-2 overflow-hidden mt-3" id={`${fieldKey}_no_data_label`}>
              <Checkbox checked={hasNoData} onCheckedChange={onNoDataChanged} id={`${fieldKey}_no_data`} />
              <span>{t('common.filters.labels.no_data')}</span>
            </label>
          )}
        </div>
      </CardContent>
      <CardFooter size="sm">
        <div className="flex align-right justify-end items-center space-x-2">
          <Button size="xxs" variant="ghost" onClick={reset} disabled={!hasUnappliedItems} id={`${fieldKey}_clear`}>
            {t('common.filters.buttons.clear')}
          </Button>
          <div className="flex space-x-2">
            <Button size="xxs" variant="outline" onClick={apply} id={`${fieldKey}_apply`}>
              {t('common.filters.buttons.apply')}
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
