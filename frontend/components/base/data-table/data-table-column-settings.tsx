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
import { ColumnSettings } from '@/components/base/data-table/data-table';
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
import { Skeleton } from '../ui/skeleton';

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
  return function(id: string) {
    return defaultSettings.find(column => column.id === id);
  };
}

/**
 * TableColumnSettings
 * Dropdown that manage column's visiblity and order
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
      setColumnsMiddle(items => {
        return arrayMove(items, items.indexOf(active.id), items.indexOf(over.id));
      });
    }
  }

  useEffect(() => {
    handleOrderChange(columnsMiddle as ColumnOrderState);
  }, [columnsMiddle]);

  if (loading) return <Skeleton className='w-[24px] h-[24px] mr-2' />;

  return (
    <span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button iconOnly variant="ghost" className="px-4 py-2 h-8">
            <SettingsIcon />
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
              Reset
            </Button>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </span>
  );
}

export default TableColumnSettings;
