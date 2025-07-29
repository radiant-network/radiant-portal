import { Button } from '@/components/base/ui/button';
import { CellContext } from '@tanstack/react-table';
import { PinIcon, PinOffIcon } from 'lucide-react';

/**
 * @FIXME unused at the time
 * Config for TableColumnDef
 * {
 *   id: 'pinRow',
 *   cell: PinRowCell,
 *   size: 40,
 *   enableResizing: false,
 *   enablePinning: false,
 * },
 *
 * Config for ColumnSettings
 * {
 *   id: 'pinRow',
 *   visible: true,
 *   fixed: true,
 *   pinningPosition: 'left',
 * },
 */
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
