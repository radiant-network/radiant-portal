import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/base/ui/button';
import { SqonOpEnum, type Statistics, type StatisticsBody, type SqonContent } from '@/api/api';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { IFilterRangeConfig, useConfig } from '@/components/model/applications-config';
import { IValueFilter, MERGE_VALUES_STRATEGIES, RangeOperators, TSqonContentValue } from '@/components/model/sqon';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { Input } from '@/components/base/ui/input';
import { Checkbox } from '@/components/base/ui/checkbox';
import { TextMuted } from '@/components/base/typography/text-muted';
import { Label } from '@/components/base/ui/label';
import ElementOperatorIcon from '@/components/base/icons/element-operator-icon';
import EqualOperatorIcon from '@/components/base/icons/equal-operator-icon';
import GreaterThanOperatorIcon from '@/components/base/icons/greater-than-operator-icon';
import GreaterThanOrEqualOperatorIcon from '@/components/base/icons/greater-than-or-equal-operator-icon';
import LessThanOperatorIcon from '@/components/base/icons/less-than-operator-icon';
import LessThanOrEqualOperatorIcon from '@/components/base/icons/less-than-or-equal-operator-icon';
import { useI18n } from '@/components/hooks/i18n';
import useSWR from 'swr';
import { occurrencesApi } from '@/utils/api';
import { Skeleton } from '@/components/base/ui/skeleton';

type OccurrenceStatisticsInput = {
  seqId: string;
  statisticsBody: StatisticsBody;
};

const statisticsFetcher = (input: OccurrenceStatisticsInput): Promise<Statistics> => {
  return occurrencesApi.statisticsOccurrences(input.seqId, input.statisticsBody).then(response => response.data);
};

function useStatisticsBuilder(field: string, shouldFetch: boolean = false, appId: string) {
  let data: OccurrenceStatisticsInput | null;

  if (!shouldFetch) {
    data = null;
  } else {
    data = {
      seqId: '1',
      statisticsBody: {
        field: field,
      },
    };
  }

  const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);

  if (activeQuery && data) {
    data.statisticsBody.sqon = {
      content: activeQuery.content as SqonContent,
      op: activeQuery.op as SqonOpEnum,
    };
  }

  return useSWR<Statistics, any, OccurrenceStatisticsInput | null>(data, statisticsFetcher, {
    revalidateOnFocus: false,
  });
}

interface IProps {
  field: AggregationConfig;
}

export function NumericalFilter({ field }: IProps) {
  const { t } = useI18n();
  const config = useConfig();
  const appId = config.variant_exploration.app_id;
  const fieldKey = field.key;
  const RANGE_OPERATOR_LABELS: Record<
    RangeOperators,
    { display: string; dropdown: string; icon: React.ComponentType<{ size?: number; className?: string }> }
  > = {
    [RangeOperators.GreaterThan]: {
      display: t('common.filters.operators.greaterThan'),
      dropdown: t('common.filters.operators.greaterThan'),
      icon: GreaterThanOperatorIcon,
    },
    [RangeOperators.LessThan]: {
      display: t('common.filters.operators.lessThan'),
      dropdown: t('common.filters.operators.lessThan'),
      icon: LessThanOperatorIcon,
    },
    [RangeOperators.Between]: {
      display: t('common.filters.operators.between'),
      dropdown: t('common.filters.operators.between'),
      icon: ElementOperatorIcon,
    },
    [RangeOperators.GreaterThanOrEqualTo]: {
      display: t('common.filters.operators.greaterThanOrEqual'),
      dropdown: t('common.filters.operators.greaterThanOrEqual'),
      icon: GreaterThanOrEqualOperatorIcon,
    },
    [RangeOperators.LessThanOrEqualTo]: {
      display: t('common.filters.operators.lessThanOrEqual'),
      dropdown: t('common.filters.operators.lessThanOrEqual'),
      icon: LessThanOrEqualOperatorIcon,
    },
    [RangeOperators.In]: {
      display: t('common.filters.operators.in'),
      dropdown: t('common.filters.operators.in'),
      icon: EqualOperatorIcon,
    },
  };

  // Fetch statistics for min/max values
  const { data: statistics, isLoading: isLoadingStats } = useStatisticsBuilder(fieldKey, true, appId);

  const [selectedRange, setSelectedRange] = useState<RangeOperators>(RangeOperators.GreaterThan);
  const [numericValue, setNumericValue] = useState<string>('0');
  const [maxValue, setMaxValue] = useState<string>('0');
  const [minValue, setMinValue] = useState<string>('0');
  const [hasNoData, setHasNoData] = useState<boolean>(false);
  // Initialize selectedUnit as undefined rather than defaulting to any value
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>();

  const [hasUnappliedItems, setHasUnappliedItems] = useState(false);

  const aggregations = config.variant_exploration.aggregations;
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

    // Find the main numeric field filter
    const numericFilter = activeQuery.content.find((x: TSqonContentValue) => {
      return 'content' in x && 'field' in x.content ? x.content.field === fieldKey : false;
    }) as IValueFilter | undefined;

    // Find the unit field filter if it exists
    const unitFilter = activeQuery.content.find((x: TSqonContentValue) => {
      if ('content' in x && 'field' in x.content) {
        return x.content.field === `${fieldKey}_unit`;
      }
      return false;
    }) as IValueFilter | undefined;

    if (numericFilter) {
      const values = numericFilter.content.value;
      console.log('[NumericalFilter] values', values);
      // Check for __missing__ value
      if (values.includes('__missing__')) {
        setHasNoData(true);
        return;
      }

      // Handle numeric values
      if (values.length === 2) {
        setSelectedRange(RangeOperators.Between);
        const minValue = Number(values[0]).toFixed(3);
        const maxValue = Number(values[1]).toFixed(3);
        setMinValue(minValue);
        setMaxValue(maxValue);
      } else {
        // Single value case
        setNumericValue(values[0] as string);
      }

      if (numericFilter.op && !aggConfig?.defaultOperator) {
        setSelectedRange(numericFilter.op as RangeOperators);
      }
    } else {
      console.log('[NumericalFilter else] no filter exists', aggConfig);
      // Reset values if no filter exists
      setHasNoData(false);

      // Use defaults from config if available
      if (aggConfig?.defaultMin !== undefined) {
        setMinValue(aggConfig.defaultMin.toString());
        setNumericValue(aggConfig.defaultMin.toString());
      } else if (statistics?.min !== undefined) {
        setMinValue(Number(statistics.min.toFixed(3)).toString());
        setNumericValue(Number(statistics.min.toFixed(3)).toString());
      }

      if (aggConfig?.defaultMax !== undefined) {
        setMaxValue(aggConfig.defaultMax.toString());
      } else if (statistics?.max !== undefined) {
        setMaxValue(Number(statistics.max.toFixed(3)).toString());
      }

      if (aggConfig?.defaultOperator) {
        setSelectedRange(RangeOperators[aggConfig.defaultOperator as keyof typeof RangeOperators]);
      }
    }

    // Handle unit if it exists
    setSelectedUnit(
      unitFilter
        ? (unitFilter.content.value[0] as string)
        : aggConfig?.rangeTypes?.length
          ? aggConfig.rangeTypes[0].key
          : undefined,
    );
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

  const reset = useCallback(() => {
    setHasUnappliedItems(false);
    initializeForm();
  }, [initializeForm]);

  const apply = useCallback(() => {
    setHasUnappliedItems(false);

    // Handle no data case
    if (hasNoData) {
      queryBuilderRemote.updateActiveQueryField(appId, {
        field: fieldKey,
        value: ['__missing__'],
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
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
    queryBuilderRemote.updateActiveQueryField(appId, {
      field: fieldKey,
      value: values,
      merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      operator: selectedRange,
    });

    // If a unit is selected, update the unit field
    if (selectedUnit) {
      queryBuilderRemote.updateActiveQueryField(appId, {
        field: `${fieldKey}_unit`,
        value: [selectedUnit],
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      });
    }
  }, [appId, fieldKey, selectedRange, numericValue, minValue, maxValue, hasNoData, selectedUnit]);

  const RangeChoices = Object.entries(RangeOperators)
    .map(([key, op]) => {
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
    <div className="p-2 w-full max-w-md" id={`${fieldKey}_container`}>
      <div className="space-y-3 pt-2">
        <div className="flex flex-col gap-3">
          <div id={`${fieldKey}_operator`}>
            <Select defaultValue={`${SqonOpEnum.GreaterThan}`} onValueChange={onRangeValueChanged}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.filters.operators.selectOperator')}>
                  {RANGE_OPERATOR_LABELS[selectedRange].display}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>{RangeChoices}</SelectContent>
            </Select>
          </div>

          {selectedRange === RangeOperators.Between ? (
            <div className="flex gap-2 flex-row">
              <Input
                className="w-half"
                value={minValue}
                onChange={e => {
                  const value = e.target.value;
                  console.log('value', value);
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
              <TextMuted>
                {t('common.filters.labels.actualInterval')} : {statistics?.min?.toFixed(3)} -{' '}
                {statistics?.max?.toFixed(3)}
              </TextMuted>
            </div>
          )}
        </div>

        {aggConfig?.rangeTypes && aggConfig.rangeTypes.length > 0 && (
          <div id={`${fieldKey}_range_type_container`}>
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
                    <SelectValue placeholder={t('common.filters.labels.selectUnit')}>
                      {aggConfig.rangeTypes.find(type => type.key === selectedUnit)?.name ||
                        t('common.filters.labels.selectUnit')}
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
          <label className="flex items-center space-x-2 overflow-hidden" id={`${fieldKey}_no_data_label`}>
            <Checkbox checked={hasNoData} onCheckedChange={onNoDataChanged} id={`${fieldKey}_no_data`} />
            <span>{t('common.filters.labels.noData')}</span>
          </label>
        )}
      </div>

      <hr className="my-4 border-border" id={`${fieldKey}_divider`} />

      <div className="flex align-right justify-end items-center space-x-2">
        <Button size="xs" variant="ghost" onClick={reset} disabled={!hasUnappliedItems} id={`${fieldKey}_clear`}>
          {t('common.filters.buttons.clear')}
        </Button>
        <div className="flex space-x-2">
          <Button size="xs" className="h-7" color="primary" onClick={apply} id={`${fieldKey}_apply`}>
            {t('common.filters.buttons.apply')}
          </Button>
        </div>
      </div>
    </div>
  );
}
