import * as React from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SettingIcon, HolderIcon } from "@/base/ui/icons";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ColumnSettings, TableColumnDef } from "@/base/ui/table/table";
import { ColumnOrderState } from "@tanstack/react-table";
import { Button } from "@/base/ui/button";

/**
 * Read user config to return column order (in asc)
 * @param settings
 * @returns ['id1', 'id2']
 */
const deserializeColumnFixed = (settings: ColumnSettings[]): string[] => {
  return settings
    .sort((a, b) => a.index - b.index)
    .filter((setting) => setting.fixed === true)
    .map((setting) => setting.id);
};

/**
 * @returns list of all columns id that are not fixed
 */
const deserializeColumns = (columns: TableColumnDef<any, any>[]) => {
  return columns.map((column) => column.id);
};

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

const TableColumnSettings = React.forwardRef<
  HTMLSpanElement,
  TableColumnSettingsProps<any>
>(
  (
    {
      columns,
      defaultSettings,
      pristine,
      visiblitySettings,
      handleVisiblityChange,
      handleReset,
      handleOrderChange,
    },
    ref
  ) => {
    const fixedColumns = deserializeColumnFixed(defaultSettings);
    const [items, setItems] = React.useState<UniqueIdentifier[]>(
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

    React.useEffect(() => {
      handleOrderChange(items as ColumnOrderState);
    }, [items]);

    return (
      <span ref={ref}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="inline-flex size-[35px] items-center justify-center rounded-full"
              aria-label="Customise options"
            >
              <SettingIcon />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[220px] bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade">
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
                      <SortableColumnSetting
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
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </span>
    );
  }
);
TableColumnSettings.displayName = "TableColumnSettings";

/**
 * SortableColumnSetting
 * - Checkbox manage columns visibility
 * - Drag'n drop manage columns order
 */
type SortableColumnSetting<TData> = {
  id: UniqueIdentifier;
  column: TableColumnDef<TData, any>;
  checked: boolean;
  handleCheckboxChange: (target: string, checked: boolean) => void;
};
const SortableColumnSetting = ({
  id,
  column,
  checked,
  handleCheckboxChange,
}: SortableColumnSetting<any>) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={id}
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-[8xp] mt-[8px] mr-[8px]")}
    >
      <div {...attributes} {...listeners}>
        <HolderIcon className="mr-[4px]" />
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          handleCheckboxChange(column.id, event.target.checked);
        }}
      />
      <label className="flex pl-[4px] text-[15px] leading-none">
        {column.header}
      </label>
    </div>
  );
};

export { TableColumnSettings };
