import { useCallback, useEffect, useState } from 'react';

import { Aggregation, SqonOpEnum } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Label } from '@/components/base/shadcn/label';
import { RadioGroup, RadioGroupItem } from '@/components/base/shadcn/radio-group';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBBooleanValue, useQBDispatch, useQBHistory } from '../hooks/use-query-builder';

import { useFacetConfig } from './hooks/use-facet-config';

type BooleanFacetProps = {
  field: AggregationConfig;
};

/**
 * @TODO: https://d3b.atlassian.net/browse/SJRA-1241 update aggregate empty check when task is done
 */
export function BooleanFacet({ field }: BooleanFacetProps) {
  const { t } = useI18n();
  const { builderFetcher } = useFacetConfig();
  const dispatch = useQBDispatch();
  const history = useQBHistory();

  const { data: apiAggregates } = builderFetcher({
    field: field.key,
  });

  const defaultItem = useQBBooleanValue(field.key);
  const [items, setItems] = useState<Aggregation[]>(apiAggregates ?? []);
  const [selectedItem, setSelectedItem] = useState<string | null>(defaultItem);

  const handlSelect = useCallback(
    (item: Aggregation) => {
      if (item.key === selectedItem) return;
      if (item.key === undefined) return;

      setSelectedItem(item.key ?? null);

      dispatch({
        type: QBActionType.ADD_OR_UPDATE_FACET_PILL,
        payload: {
          content: {
            field: field.key,
            value: [item.key],
          },
          op: SqonOpEnum.In,
        },
      });
    },
    [selectedItem],
  );

  const handleChecked = useCallback((item: Aggregation) => selectedItem === item.key, [selectedItem]);

  const handleClear = useCallback(() => {
    dispatch({
      type: QBActionType.REMOVE_FACET_PILL,
      payload: {
        content: {
          field: field.key,
          value: [selectedItem],
        },
        op: SqonOpEnum.In,
      },
    });
    setSelectedItem(null);
  }, [selectedItem]);

  useEffect(() => {
    if (apiAggregates) {
      setItems(apiAggregates);
    }
  }, [apiAggregates]);

  /**
   * Update only when field has been changed from a remote component
   */
  useEffect(() => {
    if (history.target == field.key) {
      if (defaultItem !== selectedItem) {
        setSelectedItem(defaultItem);
      }
    }
  }, [history.uuid]);

  return (
    <div className="p-2 w-full max-w-md">
      <RadioGroup>
        {items.map(item => (
          <div className="space-y-3 pt-2" key={item.key}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={item.key || ''}
                  id={item.key}
                  checked={handleChecked(item)}
                  onClick={() => {
                    handlSelect(item);
                  }}
                />
                <Label htmlFor={item.key}>{item.key}</Label>
              </div>
              <span className="bg-accent px-2 py-1 rounded-md font-mono text-xs">{item.count}</span>
            </div>
          </div>
        ))}
      </RadioGroup>

      {selectedItem !== null && (
        <>
          <hr className="my-4 border-border" />
          <div className="flex align-right justify-end items-center space-x-2">
            <Button onClick={handleClear} size="xs">
              {t('common.filters.buttons.clear')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
