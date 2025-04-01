import { CellContext } from '@tanstack/react-table';
import { MinusIcon, PlusIcon } from 'lucide-react';

function RowExpandCell({ row }: CellContext<any, any>) {
  return (
    <button className="flex w-full items-center justify-center cursor-pointer" onClick={row.getToggleExpandedHandler()}>
      {row.getIsExpanded() ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
    </button>
  );
}

export default RowExpandCell;
