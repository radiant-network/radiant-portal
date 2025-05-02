import { Button } from '@/components/base/ui/button';
import { CellContext } from '@tanstack/react-table';
import { PinIcon, PinOffIcon } from 'lucide-react';

function PinRowCell({ row }: CellContext<any, any>) {
  return (
    <Button
      iconOnly
      variant="ghost"
      className="overflow-clip"
      onClick={() => (row.getIsPinned() ? row.pin(false) : row.pin('top'))}
    >
      {row.getIsPinned() ? <PinOffIcon /> : <PinIcon />}
    </Button>
  );
}

export default PinRowCell;
