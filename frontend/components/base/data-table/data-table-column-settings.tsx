import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { ColumnOrderState, ColumnPinningState } from '@tanstack/react-table';
import { Button } from '@/base/ui/button';
import { SettingsIcon } from 'lucide-react';
import TableSortableColumnSetting from '@/components/base/data-table/data-table-sortable-column-setting';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';

/**
 * Read user config to return column order (in asc)
 * @param settings
 * @returns ['id1', 'id2']
 */
function deserializeColumnFixed(settings: ColumnSettings[], columnPinning: ColumnPinningState): string[] {
  const result = settings
    .sort((a, b) => a.index - b.index)
    .filter(setting => setting.fixed === true)
    .map(setting => setting.id);

  const iterator = (id: string) => {
    if (!result.includes(id)) {
      result.push(id);
    }
  };
  columnPinning.left?.forEach(iterator);
  columnPinning.right?.forEach(iterator);

  return result;
}

/**
 * TableColumnSettings
 * Dropdown that manage column's visiblity and order
 */
type TableColumnSettingsProps = {
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
  pristine,
  visiblitySettings,
  handleVisiblityChange,
  handleReset,
  handleOrderChange,
}: TableColumnSettingsProps) {
  const fixedColumns = deserializeColumnFixed(defaultSettings, columnPinning);
  const [items, setItems] = useState<UniqueIdentifier[]>(columnOrder);
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
      setItems(items => {
        return arrayMove(items, items.indexOf(active.id), items.indexOf(over.id));
      });
    }
  }

  useEffect(() => {
    handleOrderChange(items as ColumnOrderState);
  }, [items]);

  return (
    <span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconOnly variant="ghost">
            <SettingsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map(itemId => {
                  const column = defaultSettings.find(column => column.id === itemId);
                  if (!column) return null;
                  if (fixedColumns.includes(column.id)) return;
                  return (
                    <TableSortableColumnSetting
                      key={itemId}
                      id={itemId}
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
                setItems(columnOrder);
                handleReset();
              }}
            >
              Reset
            </Button>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </span>
  );
}

export default TableColumnSettings;
