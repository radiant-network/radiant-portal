import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/base/ui/button';
import { Label } from '@/components/base/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/base/ui/radio-group';
import { Aggregation } from '@/api/api';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { useConfig } from '@/components/model/applications-config';
import { IValueFilter, MERGE_VALUES_STRATEGIES } from '@/components/model/sqon';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { useI18n } from '@/components/hooks/i18n';

interface IProps {
  data?: Aggregation[];
  field: AggregationConfig;
}

export function ToggleFilter({ data, field }: IProps) {
  const { t } = useI18n();
  const [items, setItems] = useState<Aggregation[]>(data || []);
  // items that are include in the search
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const config = useConfig();
  const appId = config.variant_entity.app_id;

  useEffect(() => {
    // if page reload and there is item selected in the querybuilder
    let prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => {
        return x.content.field === field.key;
      });
    if (prevSelectedItems) {
      let items = prevSelectedItems.content.value;
      if (items.length >= 1) {
        setSelectedItem(items[0] as string);
      }
    } else {
      setSelectedItem(null);
    }

    setItems(data || []);
  }, [data]);

  // Memoize these functions with useCallback
  //
  const onSelect = useCallback(
    (item: Aggregation) => {
      if (item.key === selectedItem) return;
      if (item.key === undefined) return;

      setSelectedItem(item.key || null);
      queryBuilderRemote.updateActiveQueryField(appId, {
        field: field.key,
        value: [...item.key],
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES, // Default APPEND_VALUES
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
            <Button className="text-gray-600" onClick={clear}>
              {t('common.filters.buttons.clear')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
