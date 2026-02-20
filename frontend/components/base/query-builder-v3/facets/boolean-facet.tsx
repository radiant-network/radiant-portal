import { useCallback, useEffect, useState } from 'react';

import { Aggregation } from '@/api/api';
import { Button } from '@/components/base/shadcn/button';
import { Label } from '@/components/base/shadcn/label';
import { RadioGroup, RadioGroupItem } from '@/components/base/shadcn/radio-group';
import { type Aggregation as AggregationConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import { QBActionType, useQBDispatch } from '../hooks/use-query-builder';
import { IValueFacet } from '../type';

import { useFacetConfig } from './hooks/use-facet-config';

type BooleanFacetProps = {
  data?: Aggregation[];
  field: AggregationConfig;
};

export function BooleanFacet({ data, field }: BooleanFacetProps) {
  const { t } = useI18n();
  const { builderFetcher } = useFacetConfig();
  const dispatch = useQBDispatch();

  // Use the aggregation builder hook to fetch data automatically
  const { data: aggregationData } = builderFetcher({
    field: field.key,
    size: 30,
  });

  // Use data from props or from the aggregation builder
  const [items, setItems] = useState<Aggregation[]>(data || aggregationData || []);
  // items that are include in the search
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    // Update items when data changes (either from props or aggregation builder)
    setItems(data || aggregationData || []);
  }, [data, aggregationData]);

  useEffect(() => {
    // if page reload and there is item selected in the querybuilder
    // @TODO: to implement with new hooks
    const prevSelectedItems: IValueFacet | undefined = undefined;
    // const prevSelectedItems: IValueFacet | undefined = queryBuilderRemote
    //   .getActiveQuery(appId)
    //   // @ts-ignore
    //   .content.find((x: IValueFacet) => x.content.field === field.key);
    if (prevSelectedItems) {
      const items = prevSelectedItems.content.value;
      if (items.length >= 1) {
        setSelectedItem(items[0] as string);
      }
    } else {
      setSelectedItem(null);
    }
  }, [field.key]);

  // Memoize these functions with useCallback
  const onSelect = useCallback(
    (item: Aggregation) => {
      if (item.key === selectedItem) return;
      if (item.key === undefined) return;

      setSelectedItem(item.key || null);

      dispatch({
        type: QBActionType.ADD_MULTISELECT_VALUE,
        payload: {
          field: field.key,
          value: [...item.key],
        },
      });
    },
    [selectedItem],
  );

  const isSelected = useCallback((item: Aggregation) => selectedItem === item.key, [selectedItem]);

  const clear = useCallback(() => {
    setSelectedItem(null);
  }, [selectedItem]);

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
                  checked={isSelected(item)}
                  onClick={() => {
                    onSelect(item);
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
            <Button onClick={clear} size="xs">
              {t('common.filters.buttons.clear')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
