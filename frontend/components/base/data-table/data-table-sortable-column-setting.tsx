import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import { ColumnSettings } from '@/components/base/data-table/data-table';
import { GripVerticalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import VisibilityColumnSetting from '@/components/base/data-table/data-table-column-visibility-settings';

/**
 * SortableColumnSetting
 * - Manage columns order through Drag'n drop
 */
type SortableColumnSettingProps = {
  id: UniqueIdentifier;
  column: ColumnSettings;
  checked: boolean;
  sortEnabled: boolean;
  handleCheckboxChange: (target: string, checked: boolean) => void;
};
function TableSortableColumnSetting({ id, checked, column, handleCheckboxChange, sortEnabled }: SortableColumnSettingProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!sortEnabled) {
    return (
      <div key={id} className={cn('flex items-center gap-[8xp] mt-[8px] mr-[8px]')}>
        <GripVerticalIcon className="mr-[4px] opacity-50  cursor-not-allowed " size={14} />
        <VisibilityColumnSetting id={id} checked={checked} label={column.label} handleCheckboxChange={handleCheckboxChange} />
      </div>
    );
  }

  return (
    <div key={id} ref={setNodeRef} style={style} className={cn('flex items-center gap-[8xp] mt-[8px] mr-[8px]')}>
      <div {...attributes} {...listeners}>
        <GripVerticalIcon className="mr-[4px]" size={14} />
      </div>
      <VisibilityColumnSetting id={id} checked={checked} label={column.label} handleCheckboxChange={handleCheckboxChange} />
    </div>
  );
}

export default TableSortableColumnSetting;
