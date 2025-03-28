import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/base/ui/button';
import { Checkbox } from '@/components/base/ui/checkbox';
import { Input } from '@/components/base/ui/input';
import { ActionButton } from '@/components/base/Buttons';
import { Aggregation } from '@/api/api';
import { queryBuilderRemote } from '@/components/model/query-builder-core/query-builder-remote';
import { useConfig } from '@/components/model/applications-config';
import { IValueFilter, MERGE_VALUES_STRATEGIES } from '@/components/model/sqon';
import { type Aggregation as AggregationConfig } from '@/components/model/applications-config';
import { numberFormat } from '@/components/lib/number-format';
import { useI18n } from '@/components/hooks/i18n';
import { Separator } from '@/components/base/ui/separator';

interface IProps {
  data?: Aggregation[];
  field: AggregationConfig;
  maxVisibleItems?: number;
  searchVisible?: boolean;
}

function searchOptions(search: string, data: any[]) {
  return data.filter(option => option.key.toLowerCase().includes(search.toLowerCase()));
}

function getVisibleItemsCount(itemLength: number, maxVisibleItems: number) {
  return maxVisibleItems < itemLength ? maxVisibleItems : itemLength;
}

export function MultiSelectFilter({ data, field, maxVisibleItems = 10, searchVisible = false }: IProps) {
  const { t } = useI18n();
  const [items, setItems] = useState<Aggregation[]>(data || []);
  // items that are include in the search
  const [appliedSelectedItems, setAppliedSelectedItems] = useState<string[]>([]);
  // items that are currently checked
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [visibleItemsCount, setVisibleItemsCount] = useState(getVisibleItemsCount(items.length, maxVisibleItems));
  const [hasUnappliedItems, setHasUnappliedItems] = useState(false);
  const config = useConfig();
  const appId = config.variant_entity.app_id;

  useEffect(() => {
    // if page reload and there is item selected in the querybuilder
    let prevSelectedItems: IValueFilter | undefined = queryBuilderRemote
      .getResolvedActiveQuery(appId)
      // @ts-ignore
      .content.find((x: IValueFilter) => {
        return x.content.field === field.key;
      });
    if (prevSelectedItems) {
      setSelectedItems(prevSelectedItems.content.value as string[]);
    } else {
      // update data from upstream, maybe querybuilder flush the selection
      setSelectedItems([]);
    }

    data?.sort((a, b) => {
      const aSelected = a.key && selectedItems.includes(a.key);
      const bSelected = b.key && selectedItems.includes(b.key);

      if (aSelected === bSelected) {
        return b.count! - a.count!; // Then sort by count
      }

      return aSelected ? -1 : 1;
    });
    setItems(data || []);
    setVisibleItemsCount(getVisibleItemsCount(data?.length || 0, maxVisibleItems));
  }, [data]);

  // Memoize these functions with useCallback
  //
  const updateSearch = useCallback(
    (search: string) => {
      const results = searchOptions(search, data!);
      if (maxVisibleItems > results.length) {
        setVisibleItemsCount(results.length);
      } else if (results.length > maxVisibleItems) {
        setVisibleItemsCount(maxVisibleItems);
      }
      setItems(results);
    },
    [items, visibleItemsCount, data],
  );

  const showMore = useCallback(() => {
    let count = visibleItemsCount + maxVisibleItems;
    setHasUnappliedItems(true);
    setVisibleItemsCount(count > items.length ? items.length : count);
  }, [visibleItemsCount, items]);

  const selectAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      return;
    }
    setHasUnappliedItems(true);
    setSelectedItems(items.map(f => f.key!));
  }, [items, selectedItems]);

  const unSelectAll = useCallback(() => {
    if (selectedItems.length === 0) {
      return;
    }
    setHasUnappliedItems(true);
    setSelectedItems([]);
  }, [selectedItems]);

  const itemSelected = useCallback(
    (item: Aggregation) => {
      let newList: string[] = [];
      if (selectedItems.some(f => f === item.key)) {
        newList = selectedItems.filter(f => f !== item.key);
      } else {
        newList = [...selectedItems, item.key!];
      }
      setHasUnappliedItems(true);
      setSelectedItems(newList);
    },
    [selectedItems],
  );

  const reset = useCallback(() => {
    setHasUnappliedItems(false);
    setSelectedItems([...appliedSelectedItems]);
  }, [appliedSelectedItems]);

  const apply = useCallback(() => {
    setHasUnappliedItems(false);
    setAppliedSelectedItems(selectedItems);
    queryBuilderRemote.updateActiveQueryField(appId, {
      field: field.key,
      value: [...selectedItems],
      merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES, // Default APPEND_VALUES
    });
  }, [selectedItems]);

  return (
    <div className="p-2 w-full max-w-md">
      {searchVisible && (
        <Input
          type="text"
          placeholder={t('common.filters.search.placeholder')}
          className="w-full p-2 mb-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={e => updateSearch(e.target.value)}
        />
      )}

      <div className="flex justify-between">
        <Button size="sm" onClick={() => selectAll()} variant="link">
          {t('common.filters.buttons.all')}
        </Button>
        <Button size="sm" onClick={() => unSelectAll()} variant="link">
          {t('common.filters.buttons.none')}
        </Button>
      </div>

      <div>
        {Array.from({ length: visibleItemsCount }, (_, i) => (
          <div className="space-y-3 pt-2" key={items[i].key}>
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2 overflow-hidden">
                <Checkbox
                  className="w-4 h-4"
                  checked={selectedItems.some(f => f === items[i].key)}
                  onCheckedChange={() => itemSelected(items[i])}
                />
                <div className="overflow-hidden text-ellipsis">{items[i].key}</div>
                <span className="checkmark"></span>
              </label>
              <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">{numberFormat(items[i].count || 0)}</span>
            </div>
          </div>
        ))}
      </div>

      {items.length > visibleItemsCount && (
        <Button className="mt-2" onClick={showMore} size="sm" variant="link">
          {t('common.filters.buttons.showMore')}
        </Button>
      )}

      <Separator className="my-2.5" />

      <div className="flex align-right justify-end items-center space-x-2">
        <Button className="text-gray-600" onClick={reset} disabled={!hasUnappliedItems}>
          {t('common.filters.buttons.clear')}
        </Button>
        <div className="flex space-x-2">
          <ActionButton size="sm" className="h-7" color="primary" actions={[]} onDefaultAction={apply}>
            {t('common.filters.buttons.apply')}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
