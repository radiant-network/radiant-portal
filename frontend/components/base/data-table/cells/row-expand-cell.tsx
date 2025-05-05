import { Button } from '@/components/base/ui/button';
import { CellContext } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

function RowExpandCell({ row }: CellContext<any, any>) {
  return (
    <div className="flex items-center justify-center">
      <Button
        iconOnly
        variant="ghost"
        onClick={row.getToggleExpandedHandler()}
        className="text-muted-foreground size-6"
      >
        {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </Button>
    </div>
  );
}

export default RowExpandCell;
