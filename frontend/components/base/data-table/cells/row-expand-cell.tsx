import type { CellContext } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

function RowExpandCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-center">
      <Button
        iconOnly
        variant="ghost"
        aria-label={row.getIsExpanded() ? t('a11y.data_table.collapse_row') : t('a11y.data_table.expand_row')}
        aria-expanded={row.getIsExpanded()}
        onClick={row.getToggleExpandedHandler()}
        className="text-muted-foreground size-6"
      >
        {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </Button>
    </div>
  );
}

export default RowExpandCell;
