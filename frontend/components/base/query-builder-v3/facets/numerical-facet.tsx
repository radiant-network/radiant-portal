import { useCallback, useEffect, useMemo, useState } from 'react';

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
import { Input } from '@/components/base/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/shadcn/select';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { TextMuted } from '@/components/base/typography/text-muted';
import { IFilterRangeConfig } from '@/components/cores/applications-config';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import i18n, { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import {
  QBActionType,
  useQBActiveQuery,
  useQBAggregationsNumericalConfig,
  useQBContext,
  useQBDispatch,
  useQBHistory,
  useQBNumericalSqon,
} from '../hooks/use-query-builder';
import { IValueFacet, RangeOperators } from '../type';

const INTEGER_TYPE = 'integer';

type NumericalFacetProps = {
  field: AggregationConfig;
};

/**
 * Does the field will display an interval?
 * If not, it will enable no-data checkbox
 */
function getHasInterval(config: IFilterRangeConfig, statistics?: Statistics): boolean {
  if (config.intervalDecimal !== undefined && config.max !== undefined && config.min !== undefined) {
    return true;
  } else if (statistics != undefined && statistics.min !== undefined && statistics.max !== undefined) {
    return true;
  }

  return false;
}

/**
 * Return the allowed number of decimal
 *
 * e.g. 0.111 || 0
 */
function getDecimal(type: string | undefined) {
  return !type || type === INTEGER_TYPE ? 0 : 3;
}

/**
 * Read config or statistic's api result to
 * set min, max, range and default numerical value
 */
type NumericalValueProps = {
  sqon?: IValueFacet;
  config: IFilterRangeConfig;
  statistics?: Statistics;
};
type NumericalValueResult = {
  selectedRange: RangeOperators;
  minValue: string;
  maxValue: string;
  numericalValue: string;
};
function getNumericalValue({ sqon, config, statistics }: NumericalValueProps): NumericalValueResult {
  let selectedRange: RangeOperators = config?.defaultOperator ?? RangeOperators.LessThan;
  let minValue: string = '0';
  let maxValue: string = '0';
  let numericalValue: string = '';
  const decimal = getDecimal(statistics?.type);

  if (sqon) {
    // Handle numeric values
    if (sqon.content.value.length === 2) {
      selectedRange = RangeOperators.Between;
      minValue = Number(Number(sqon.content.value[0]).toFixed(decimal)).toLocaleString(i18n.language);
      maxValue = Number(Number(sqon.content.value[1]).toFixed(decimal)).toLocaleString(i18n.language);
    } else {
      // Single value case
      numericalValue = Number(sqon.content.value[0]).toLocaleString(i18n.language);
    }

    if (sqon.op) {
      selectedRange = sqon.op as RangeOperators;
    }

    return {
      selectedRange,
      minValue,
      maxValue,
      numericalValue,
    };
  }
  // check statistics first to set default values
  if (statistics?.min !== undefined) {
    minValue = Number(statistics.min.toFixed(decimal)).toLocaleString(i18n.language);
    numericalValue = Number(statistics.min.toFixed(decimal)).toLocaleString(i18n.language);
  } else if (config.defaultMin !== undefined) {
    minValue = config.defaultMin.toLocaleString(i18n.language);
    numericalValue = config.defaultMin.toLocaleString(i18n.language);
  }

  if (statistics?.max !== undefined) {
    maxValue = Number(statistics.max.toFixed(decimal)).toLocaleString(i18n.language);
  } else if (config.defaultMax !== undefined) {
    maxValue = config.defaultMax.toLocaleString(i18n.language);
  }

  if (config.defaultOperator) {
    selectedRange = config.defaultOperator;
  }

  return {
    selectedRange,
    minValue,
    maxValue,
    numericalValue,
  };
}

/**
 * Interval text component
 */
type IntervalProps = {
  isLoading: boolean;
  field: string;
  min?: number;
  max?: number;
  decimal: number;
};
function NumericalInterval({ isLoading, field, min, max, decimal }: IntervalProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="flex mb-2">
        <Skeleton className="h-5 w-16 mr-1" />
        <Skeleton className="h-5 w-32" />
      </div>
    );
  }
  const options = { minimumFractionDigits: decimal, maximumFractionDigits: decimal };
  return (
    <div id={`${field}_interval`} className="mb-1">
      <TextMuted size="xs">
        {t('common.filters.labels.actual_interval', {
          min: min !== undefined ? thousandNumberFormat(min, options) : undefined,
          max: max !== undefined ? thousandNumberFormat(max, options) : undefined,
        })}
      </TextMuted>
    </div>
  );
}

/**
 * Numerical facet
 * -Use statistics API for dynamic min/max values
 * -Configurable decimal precision and intervals
 * -Unit selection for range types
 * -"No data" option for missing values
 * -Decimal is set to 3 by default (integer will be 0)
 *
 * @TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done
 * @TODO: no data has been removed since none of the facet needs it at the moment
 */
export function NumericalFacet({ field }: NumericalFacetProps) {
  const { t } = useI18n();
  const { activeQueryId } = useQBContext();
  const dispatch = useQBDispatch();
  const history = useQBHistory();
  const { appId } = useFacetConfig();
  const { statisticFetcher } = useFacetConfig();
  const activeQuery = useQBActiveQuery();
  const sqon = useQBNumericalSqon(field.key);
  const rangeOperators = useMemo(
    () => ({
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
    }),
    [],
  );

  const { data: statistics, isLoading } = statisticFetcher({ field: field.key });
  const decimal = getDecimal(statistics?.type);
  const [selectedRange, setSelectedRange] = useState<RangeOperators>(RangeOperators.GreaterThan);
  const [numericValue, setNumericValue] = useState<string>('0');
  const [maxValue, setMaxValue] = useState<string>('0');
  const [minValue, setMinValue] = useState<string>('0');

  const [isPristine, setIsPristine] = useState<boolean>(sqon === undefined);
  const config = useQBAggregationsNumericalConfig(field.key);
  const hasInterval = getHasInterval(config, statistics);

  // Determine min/max values with precedence: confib first, then statistics
  const inputMin = config?.min ?? statistics?.min ?? 0;
  const inputMax = config?.max ?? statistics?.max ?? 100;

  const handleRangeValueChanged = useCallback((value: string) => {
    setSelectedRange(value as RangeOperators);
    setIsPristine(false);
  }, []);

  const handleSetFacet = useCallback((result: NumericalValueResult) => {
    setMinValue(result.minValue);
    setMaxValue(result.maxValue);
    setSelectedRange(result.selectedRange);
    setNumericValue(result.numericalValue);
  }, []);

  const reset = () => {
    // use an empty sqon to reset to default config/statistic value
    const result = getNumericalValue({ sqon: undefined, config, statistics });
    setIsPristine(true);
    handleSetFacet(result);
  };

  const handleApply = useCallback(() => {
    setIsPristine(true);
    let values: number[] = [];
    if (selectedRange === RangeOperators.Between) {
      values = [parseFloat(minValue.toString()), parseFloat(maxValue.toString())];
    } else {
      values = [parseFloat(numericValue.toString())];
    }
    dispatch({
      type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
      payload: {
        content: {
          field: field.key,
          value: values,
        },
        op: selectedRange,
      },
    });
  }, [appId, field.key, selectedRange, numericValue, minValue, maxValue]);

  /**
   * Update min/max values when statistics are loaded
   */
  useEffect(() => {
    if (!activeQuery?.content) return;
    const result = getNumericalValue({ sqon, config, statistics });
    handleSetFacet(result);
  }, [sqon, activeQuery, config, statistics]);

  /**
   * Update only when field has been changed from a remote component
   */
  useEffect(() => {
    if (history.target == field.key) {
      const result = getNumericalValue({ sqon, config, statistics });
      handleSetFacet(result);
    }
  }, [history.uuid]);

  /**
   * Update when active query change
   */
  useEffect(() => {
    const result = getNumericalValue({ sqon, config, statistics });
    handleSetFacet(result);
  }, [activeQueryId]);

  return (
    <>
      <CardContent id={`${field.key}_container`} size="sm" variant="outline">
        <div className="pt-2">
          <div className="flex flex-col gap-3">
            <div id={`${field.key}_operator`}>
              <Select value={selectedRange} onValueChange={handleRangeValueChanged}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder={t('common.filters.operators.select_operator')}>
                    {rangeOperators[selectedRange]?.display || t('common.filters.operators.unknown')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RangeOperators).map(([_key, op]) => {
                    const Icon = rangeOperators[op as RangeOperators].icon;
                    return (
                      <SelectItem key={op} value={op}>
                        <div className="flex items-center gap-2">
                          <Icon size={16} />
                          <span>{rangeOperators[op as RangeOperators].dropdown}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
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
                    setIsPristine(false);
                  }}
                  min={inputMin}
                  max={inputMax}
                  id={`${field.key}_min`}
                  data-testid={`${field.key}_min`}
                />
                <Input
                  size="xs"
                  className="w-half"
                  value={maxValue}
                  onChange={e => {
                    const value = e.target.value;
                    if (isNaN(Number(value))) return;
                    setMaxValue(value);
                    setIsPristine(false);
                  }}
                  min={inputMin}
                  max={inputMax}
                  id={`${field.key}_max`}
                  data-testid={`${field.key}_max`}
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
                  setIsPristine(false);
                }}
                min={inputMin}
                max={inputMax}
                id={`${field.key}_value`}
                data-testid={`${field.key}_value`}
              />
            )}

            {hasInterval && (
              <NumericalInterval
                isLoading={isLoading}
                field={field.key}
                min={statistics?.min}
                max={statistics?.max}
                decimal={decimal}
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter size="sm">
        <div className="flex align-right justify-end items-center space-x-2">
          <Button size="xxs" variant="ghost" onClick={reset} disabled={isPristine} id={`${field.key}_clear`}>
            {t('common.filters.buttons.clear')}
          </Button>
          <div className="flex space-x-2">
            <Button size="xxs" variant="outline" onClick={handleApply} id={`${field.key}_apply`}>
              {t('common.filters.buttons.apply')}
            </Button>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
