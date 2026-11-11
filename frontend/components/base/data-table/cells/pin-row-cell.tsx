import type { CellContext } from '@tanstack/react-table';
import { PinIcon, PinOffIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

function PinRowCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();

  return (
    <div className="flex justify-center items-center">
      <Button
        iconOnly
        variant="ghost"
        className="overflow-clip text-muted-foreground size-6"
        aria-label={row.getIsPinned() ? t('a11y.data_table.unpin_row') : t('a11y.data_table.pin_row')}
        onClick={() => (row.getIsPinned() ? row.pin(false) : row.pin('top'))}
      >
        {row.getIsPinned() ? <PinOffIcon /> : <PinIcon />}
      </Button>
    </div>
  );
}

export default PinRowCell;
