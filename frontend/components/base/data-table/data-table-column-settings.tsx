import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnSettings,
  TableColumnDef,
} from "@/components/base/data-table/data-table";
import { ColumnOrderState } from "@tanstack/react-table";
import { Button } from "@/base/ui/button";
import { SettingsIcon } from "lucide-react";
import TableSortableColumnSetting from "@/components/base/data-table/data-table-sortable-column-setting";
import IconButton from "@/components/base/Buttons/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/base/ui/dropdown-menu";

/**
 * Read user config to return column order (in asc)
 * @param settings
 * @returns ['id1', 'id2']
 */
const deserializeColumnFixed = (settings: ColumnSettings[]): string[] =>
  settings
    .sort((a, b) => a.index - b.index)
    .filter((setting) => setting.fixed === true)
    .map((setting) => setting.id);

/**
 * @returns list of all columns id that are not fixed
 */
const deserializeColumns = (columns: TableColumnDef<any, any>[]) =>
  columns.map((column) => column.id);

/**
 * TableColumnSettings
 * Dropdown that manage column's visiblity and order
 */
type TableColumnSettingsProps<TData> = {
  columns: TableColumnDef<TData, any>[];
  defaultSettings: ColumnSettings[];
  visiblitySettings: {
    [key: string]: boolean;
  };
  pristine: boolean;
  handleVisiblityChange: (target: string, checked: boolean) => void;
  handleOrderChange: (columnOrder: ColumnOrderState) => void;
  handleReset: () => void;
};

const TableColumnSettings = ({
  columns,
  defaultSettings,
  pristine,
  visiblitySettings,
  handleVisiblityChange,
  handleReset,
  handleOrderChange,
}: TableColumnSettingsProps<any>) => {
  const fixedColumns = deserializeColumnFixed(defaultSettings);
  const [items, setItems] = useState<UniqueIdentifier[]>(
    deserializeColumns(columns)
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setItems((items) => {
        return arrayMove(
          items,
          items.indexOf(active.id),
          items.indexOf(over.id)
        );
      });
    }
  };

  useEffect(() => {
    handleOrderChange(items as ColumnOrderState);
  }, [items]);

  return (
    <span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton icon={SettingsIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="min-w-[220px] bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((id) => {
                  const column = columns.find((column) => column.id === id);
                  if (!column) return null;
                  if (fixedColumns.includes(column.id)) return;
                  return (
                    <TableSortableColumnSetting
                      key={id}
                      id={id}
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
              onClick={() => {
                setItems(deserializeColumns(columns));
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
};

export default TableColumnSettings;
