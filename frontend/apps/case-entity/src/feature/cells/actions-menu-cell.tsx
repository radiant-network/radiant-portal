import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import AssayInformationsDialog from '@/components/feature/assays/assay-information-dialog';
import { useI18n } from '@/components/hooks/i18n';
import { CaseEntityTabs } from '@/types';

function ActionsMenuCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <AssayInformationsDialog
          open={assayDialogOpen}
          onClose={() => setAssayDialogOpen(false)}
          seqId={row.original.seq_id}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button iconOnly variant="outline" onClick={row.getToggleExpandedHandler()} className="size-6">
              {<EllipsisVertical />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={!row.original.has_variants}
              onClick={() => {
                searchParams.set('tab', CaseEntityTabs.Variants);
                searchParams.set('seq_id', row.original.seq_id);
                setSearchParams(searchParams, { replace: true });
              }}
            >
              <ExternalLink />
              {t('case_exploration.case.actions.view_variant')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setAssayDialogOpen(true);
              }}
            >
              <ExternalLink />
              {t('case_exploration.case.actions.view_assay')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default ActionsMenuCell;
