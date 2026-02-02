import { useEffect } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

type TableColumnSettingsProps = {
  columnOrder: ColumnOrderState;
  setColumnOrder: (value: string[]) => void;
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
  return (id: string) => defaultSettings.find(column => column.id === id);
}

/**
 * TableColumnSettings
 * Dropdown that manage column's visiblity and order
 *
 * @WARNING: There is a small workaround to make tooltip works with DropdownMenu.
 *           it must be set has a child of Button and edit his sideOffset manualy
 */
function TableColumnSettings({
  columnOrder,
  setColumnOrder,
  columnPinning,
  defaultSettings,
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
      setColumnOrder(
        arrayMove(columnOrder, columnOrder.indexOf(active.id as string), columnOrder.indexOf(over.id as string)),
      );
    }
  }

  useEffect(() => {
    handleOrderChange(columnOrder as ColumnOrderState);
  }, [columnOrder]);

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
              <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
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

                {columnOrder.map(itemId => {
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
