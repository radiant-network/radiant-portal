import { useEffect, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ColumnOrderState, ColumnPinningState } from '@tanstack/react-table';
import { SettingsIcon } from 'lucide-react';

import { Button } from '@/base/shadcn/button';
import { ColumnSettings } from '@/components/base/data-table/data-table';
import TableSortableColumnSetting from '@/components/base/data-table/data-table-sortable-column-setting';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/base/shadcn/dropdown-menu';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

/**
 * Read user config to return column order (in asc)
 * @param settings
 * @returns ['id1', 'id2']
 */
function deserializeColumnsFixed(settings: ColumnSettings[]): string[] {
  const result = settings
    .sort((a, b) => a.index - b.index)
    .filter(setting => setting.fixed === true)
    .map(setting => setting.id);

  return result;
}

function filterColumnById(defaultSettings: ColumnSettings[]) {
  return function (id: string) {
    return defaultSettings.find(column => column.id === id);
  };
}

/**
 * TableColumnSettings
 * Dropdown that manage column's visiblity and order
 *
 * @WARNING: There is a small workaround to make tooltip works with DropdownMenu.
 *           it must be set has a child of Button and edit his sideOffset manualy
 */
type TableColumnSettingsProps = {
  loading?: boolean;
  columnOrder: ColumnOrderState;
  columnPinning: ColumnPinningState;
  defaultSettings: ColumnSettings[];
  visiblitySettings: {
    [key: string]: boolean;
  };
  pristine: boolean;
  handleVisiblityChange: (target: string, checked: boolean) => void;
  handleOrderChange: (columnOrder: ColumnOrderState) => void;
  handleReset: () => void;
};

function TableColumnSettings({
  columnOrder,
  columnPinning,
  defaultSettings,
  loading = true,
  pristine,
  visiblitySettings,
  handleVisiblityChange,
  handleReset,
  handleOrderChange,
}: TableColumnSettingsProps) {
  const { t } = useI18n();
  const fixedColumns = deserializeColumnsFixed(defaultSettings);
  const columnsLeft = (columnPinning.left ?? []).map(filterColumnById(defaultSettings));
  const columnsRight = (columnPinning.right ?? []).map(filterColumnById(defaultSettings));
  const [columnsMiddle, setColumnsMiddle] = useState<UniqueIdentifier[]>(columnOrder);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setColumnsMiddle(items => arrayMove(items, items.indexOf(active.id), items.indexOf(over.id)));
    }
  }

  useEffect(() => {
    handleOrderChange(columnsMiddle as ColumnOrderState);
  }, [columnsMiddle]);

  if (loading) return <Skeleton className="w-[24px] h-[24px] mr-2" />;

  return (
    <span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" iconOnly variant="ghost">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SettingsIcon />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={12}>{t('common.table.columns')}</TooltipContent>
            </Tooltip>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={columnsMiddle} strategy={verticalListSortingStrategy}>
                {columnsLeft.map(column => {
                  if (!column || fixedColumns.includes(column.id)) return null;
                  return (
                    <TableSortableColumnSetting
                      sortEnabled={false}
                      key={column.id}
                      id={column.id}
                      column={column}
                      checked={visiblitySettings[column.id]}
                      handleCheckboxChange={handleVisiblityChange}
                    />
                  );
                })}

                {columnsMiddle.map(itemId => {
                  const column = defaultSettings.find(column => column.id === itemId);
                  if (
                    !column ||
                    (columnPinning.left ?? []).includes(column.id) ||
                    (columnPinning.right ?? []).includes(column.id) ||
                    fixedColumns.includes(column.id)
                  ) {
                    return null;
                  }

                  return (
                    <TableSortableColumnSetting
                      sortEnabled={true}
                      key={itemId}
                      id={itemId}
                      column={column}
                      checked={visiblitySettings[column.id]}
                      handleCheckboxChange={handleVisiblityChange}
                    />
                  );
                })}

                {columnsRight.map(column => {
                  if (!column || fixedColumns.includes(column.id)) return null;
                  return (
                    <TableSortableColumnSetting
                      sortEnabled={false}
                      key={column.id}
                      id={column.id}
                      column={column}
                      checked={visiblitySettings[column.id]}
                      handleCheckboxChange={handleVisiblityChange}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
            <Button
              disabled={pristine}
              variant="ghost"
              className="mt-2"
              onClick={() => {
                setColumnsMiddle(columnOrder);
                handleReset();
              }}
            >
              {t('common.table.reset')}
            </Button>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </span>
  );
}

export default TableColumnSettings;
