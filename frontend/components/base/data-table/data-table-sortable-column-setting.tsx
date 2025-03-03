import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { TableColumnDef } from "@/components/base/data-table/data-table";
import { GripVerticalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
function TableSortableColumnSetting({
  id,
  column,
  checked,
  handleCheckboxChange,
}: SortableColumnSetting<any>) {
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
        <GripVerticalIcon className="mr-[4px]" size={14} />
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
}

export default TableSortableColumnSetting;
