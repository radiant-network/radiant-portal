import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { UniqueIdentifier } from '@dnd-kit/core';
import { ColumnSettings } from '@/components/base/data-table/data-table';
import { GripVerticalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { useI18n } from '@/components/hooks/i18n';

/**
 * SortableColumnSetting
 * - Checkbox manage columns visibility
 * - Drag'n drop manage columns order
 */
type SortableColumnSettingProps<TData> = {
  id: UniqueIdentifier;
  column: ColumnSettings;
  checked: boolean;
  handleCheckboxChange: (target: string, checked: boolean) => void;
};
function TableSortableColumnSetting({ id, column, checked, handleCheckboxChange }: SortableColumnSettingProps<any>) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div key={id} ref={setNodeRef} style={style} className={cn('flex items-center gap-[8xp] mt-[8px] mr-[8px]')}>
      <div {...attributes} {...listeners}>
        <GripVerticalIcon className="mr-[4px]" size={14} />
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={value => {
          handleCheckboxChange(column.id, !!value);
        }}
      />
      <label className="flex pl-[4px] text-[15px] leading-none">{t(`variant.headers.${column.id}`)}</label>
    </div>
  );
}

export default TableSortableColumnSetting;
