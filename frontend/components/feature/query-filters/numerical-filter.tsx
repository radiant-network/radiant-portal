import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/base/ui/button';
import { Aggregation, SqonOpEnum } from '@/api/api';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { IFilterRangeConfig, useConfig } from '@/components/model/applications-config';
import { IValueFilter, MERGE_VALUES_STRATEGIES, RangeOperators, TSqonContentValue } from '@/components/model/sqon';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/base/ui/select';
import { Input } from '@/components/base/ui/input';
import { Checkbox } from '@/components/base/ui/checkbox';
import { TextMuted } from '@/components/base/typography/text-muted';
import { Label } from '@/components/base/ui/label';
import ElementOperatorIcon from "@/components/base/icons/element-operator-icon";
import EqualOperatorIcon from "@/components/base/icons/equal-operator-icon";
import GreaterThanOperatorIcon from "@/components/base/icons/greater-than-operator-icon";
import GreaterThanOrEqualOperatorIcon from "@/components/base/icons/greater-than-or-equal-operator-icon";
import LessThanOperatorIcon from "@/components/base/icons/less-than-operator-icon";
import LessThanOrEqualOperatorIcon from "@/components/base/icons/less-than-or-equal-operator-icon";

const RANGE_OPERATOR_LABELS: Record<RangeOperators, { display: string; dropdown: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  [RangeOperators.GreaterThan]: { display: 'Greater than', dropdown: 'Greater than', icon: GreaterThanOperatorIcon },
  [RangeOperators.LessThan]: { display: 'Less than', dropdown: 'Less than', icon: LessThanOperatorIcon },
  [RangeOperators.Between]: { display: 'Between', dropdown: 'Between', icon: ElementOperatorIcon },
  [RangeOperators.GreaterThanOrEqualTo]: { display: 'Greater than or equal to', dropdown: 'Greater than or equal to', icon: GreaterThanOrEqualOperatorIcon },
  [RangeOperators.LessThanOrEqualTo]: { display: 'Less than or equal to', dropdown: 'Less than or equal to', icon: LessThanOrEqualOperatorIcon },
  [RangeOperators.In]: { display: 'In', dropdown: 'In', icon: EqualOperatorIcon },
};

interface IProps {
  field: AggregationConfig;
}

export function NumericalFilter({ field }: IProps) {
  const fieldKey = field.key;
  const [selectedRange, setSelectedRange] = useState<RangeOperators>(RangeOperators.GreaterThan);
  const [numericValue, setNumericValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [minValue, setMinValue] = useState<number>(0);
  const [hasNoData, setHasNoData] = useState<boolean>(false);
  // Initialize selectedUnit as undefined rather than defaulting to any value
  const [selectedUnit, setSelectedUnit] = useState<string | undefined>();

  const [hasUnappliedItems, setHasUnappliedItems] = useState(false);

  const config = useConfig();
  const aggregations = config.variant_entity.aggregations;
  const aggConfig = aggregations.find(agg => agg.key === fieldKey)?.defaults as IFilterRangeConfig;
  const appId = config.variant_entity.app_id;
  const noDataInputOption = field.type === 'numerical';
  const hasInterval = (aggConfig?.intervalDecimal !== undefined
    && aggConfig?.max !== undefined
    && aggConfig?.min !== undefined);

  useEffect(() => {
    const activeQuery = queryBuilderRemote.getResolvedActiveQuery(appId);
    if (!activeQuery?.content) return;

    // Find the main numeric field filter
    const numericFilter = activeQuery.content.find((x: TSqonContentValue) => {
      return ('content' in x && 'field' in x.content) ? x.content.field === fieldKey : false;
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
      
      // Check for __missing__ value
      if (values.includes('__missing__')) {
        setHasNoData(true);
        return;
      }

      // Handle numeric values
      if (values.length === 2) {
        setSelectedRange(RangeOperators.Between);
        setMinValue(Number(values[0]));
        setMaxValue(Number(values[1]));
      }

      // Set the operator if it's not already set by defaultOperator
      if (numericFilter.op && !aggConfig?.defaultOperator) {
        setSelectedRange(numericFilter.op as RangeOperators);
      }
    } else {
      // Reset values if no filter exists, but use defaults from config if available
      if (aggConfig?.defaultMin !== undefined) {
        setMinValue(aggConfig.defaultMin);
      }

      if (aggConfig?.defaultMax !== undefined) {
        setMaxValue(aggConfig.defaultMax);
      }     

      if (aggConfig?.defaultOperator) {
        setSelectedRange(aggConfig.defaultOperator);
      }
      
      setHasNoData(false);
    }

    // Handle unit if it exists
    if (unitFilter) {
      const unitValue = unitFilter.content.value[0];
      setSelectedUnit(unitValue as string);
    } else if (aggConfig?.rangeTypes?.length) {
      // Only set first range type as default if no defaultUnit specified
      console.log('aggConfig.rangeTypes', aggConfig.rangeTypes);
      setSelectedUnit(aggConfig.rangeTypes[0].key);
    }
  }, [appId, fieldKey, aggConfig]);

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
    setHasNoData(false);
    
    // Use default values from config if available
    if (aggConfig?.defaultMin !== undefined) {
      setMinValue(aggConfig.defaultMin);
      setNumericValue(aggConfig.defaultMin);
    }    
    if (aggConfig?.defaultMax !== undefined) {
      setMaxValue(aggConfig.defaultMax);
    }
  }, [aggConfig]);

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
    values = selectedRange === RangeOperators.Between 
      ? [parseFloat(minValue.toString()), parseFloat(maxValue.toString())]
      : [parseFloat(numericValue.toString())];

    // Update the main field with numeric values
    queryBuilderRemote.updateActiveQueryField(appId, {
      field: fieldKey,
      value: values,
      merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
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

  const RangeChoices = Object.entries(RangeOperators).map(([key, op]) => {
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
  }).filter(Boolean);

  return (
    <div className="p-2 w-full max-w-md" id={`${fieldKey}_container`}>
      <div className="space-y-3 pt-2">
        <div className="flex flex-col gap-3">
          <div id={`${fieldKey}_operator`}>
            <Select 
              defaultValue={`${SqonOpEnum.GreaterThan}`} 
              onValueChange={onRangeValueChanged}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range operator">
                  {RANGE_OPERATOR_LABELS[selectedRange].display}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RangeChoices}
              </SelectContent>
            </Select>
          </div>

          {selectedRange === RangeOperators.Between ? (
            <div className="flex gap-2 flex-row">
              <Input 
                type="number"
                className="w-half" 
                value={minValue}
                onChange={(e) => {
                  setMinValue(Number(e.target.value));
                  setHasUnappliedItems(true);
                }}
                min={aggConfig?.min}
                max={aggConfig?.max}
                id={`${fieldKey}_min`}
                data-testid={`${fieldKey}_min`}
              />
              <Input 
                type="number"
                className="w-half" 
                value={maxValue}
                onChange={(e) => {
                  setMaxValue(Number(e.target.value));
                  setHasUnappliedItems(true);
                }}
                min={aggConfig?.min}
                max={aggConfig?.max}
                id={`${fieldKey}_max`}
                data-testid={`${fieldKey}_max`}
              />
            </div>) :
            <Input 
              type="number"
              className="w-full" 
              value={numericValue}
              onChange={(e) => setNumericValue(Number(e.target.value))}
              min={aggConfig?.min}
              max={aggConfig?.max}
              id={`${fieldKey}_value`}
              data-testid={`${fieldKey}_value`}
            />
          }

          {hasInterval && (
            <div id={`${fieldKey}_interval`}>
              <TextMuted>Actual interval : {aggConfig.min} - {aggConfig.max}</TextMuted>
            </div>
          )}

        </div>

        {aggConfig?.rangeTypes && aggConfig.rangeTypes.length > 0 && (
          <div id={`${fieldKey}_range_type_container`}>
            <Label className="text-sm" id={`${fieldKey}_unit_label`}>Unit</Label>
              <Select 
                defaultValue={selectedUnit || aggConfig.rangeTypes[0].key}
                onValueChange={onRangeTypeChanged}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit">
                    {aggConfig.rangeTypes.find(type => type.key === selectedUnit)?.name || 'Select unit'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {aggConfig.rangeTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
        )}

        {noDataInputOption && (
          <label className="flex items-center space-x-2 overflow-hidden" id={`${fieldKey}_no_data_label`}>
            <Checkbox
              checked={hasNoData}
              onCheckedChange={onNoDataChanged}
              id={`${fieldKey}_no_data`}
            />
            <span>No data</span>
          </label>
        )}
      </div>

      <hr className="my-4 border-border" id={`${fieldKey}_divider`} />

      <div className="flex align-right justify-end items-center space-x-2">
        <Button 
          className="text-gray-600" 
          onClick={reset} 
          disabled={!hasUnappliedItems}
          id={`${fieldKey}_clear`}
        >
          Clear
        </Button>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="h-7" 
            color="primary" 
            onClick={apply}
            id={`${fieldKey}_apply`}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}