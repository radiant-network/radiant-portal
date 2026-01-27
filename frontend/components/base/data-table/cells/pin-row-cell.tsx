import { CellContext } from '@tanstack/react-table';
import { PinIcon, PinOffIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';

function PinRowCell({ row }: CellContext<any, any>) {
  return (
    <div className="flex justify-center items-center">
      <Button
        iconOnly
        variant="ghost"
        className="overflow-clip text-muted-foreground size-6"
        onClick={() => (row.getIsPinned() ? row.pin(false) : row.pin('top'))}
      >
        {row.getIsPinned() ? <PinOffIcon /> : <PinIcon />}
      </Button>
    </div>
  );
}

export default PinRowCell;
