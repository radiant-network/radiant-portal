import { Button } from '@/components/base/ui/button';
import { CellContext } from '@tanstack/react-table';
import { MinusIcon, PlusIcon } from 'lucide-react';

function RowExpandCell({ row }: CellContext<any, any>) {
  return (
    <Button iconOnly variant="ghost" onClick={row.getToggleExpandedHandler()}>
      {row.getIsExpanded() ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
    </Button>
  );
}

export default RowExpandCell;
