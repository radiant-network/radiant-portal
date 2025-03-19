import { CellContext } from '@tanstack/react-table';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { IconButton } from '@/components/base/Buttons';

function RowExpandCell({ row }: CellContext<any, any>) {
  return (
    <IconButton
      className="cursor-pointer"
      icon={row.getIsExpanded() ? MinusIcon : PlusIcon}
      onClick={row.getToggleExpandedHandler()}
    />
  );
}

export default RowExpandCell;
