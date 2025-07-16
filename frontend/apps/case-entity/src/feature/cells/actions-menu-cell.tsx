
import { Button } from '@/components/base/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/base/ui/dropdown-menu';
import InformationField from '@/components/base/information/information-field';
import { useI18n } from '@/components/hooks/i18n';
import { CellContext } from '@tanstack/react-table';
import { EllipsisVertical, ExternalLink } from 'lucide-react';
import { useState } from 'react';


type AssayInformationsDialogProps = {
  open: boolean;
  onClose: (value: boolean) => void;
};
function AssayInformationsDialog({ open, onClose }: AssayInformationsDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={(value: boolean) => onClose(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('caseEntity.details.assayDetailsDialog')}</DialogTitle>
        </DialogHeader>

        {/* Status */}
        <div className="grid grid-cols-3 gap-y-3 gap-x-4 text-sm">
          <div className='grid grid-cols-2 col-span-1'>
            <InformationField label={t('caseEntity.details.status')}><>todo</></InformationField>

            {/* Created On */}
            <InformationField label={t('caseEntity.details.createdOn')} tooltipsText={t('caseEntity.details.createdOn_tooltips')} >
              <>todo</>
            </InformationField>

            {/* Last Update */}
            <InformationField label={t('caseEntity.details.lastUpdate')} tooltipsText={t('caseEntity.details.lastUpdate_tooltips')} >
              <>todo</>
            </InformationField>

            {/* Diag. Lab. */}
            <InformationField label={t('caseEntity.details.diagLab')} tooltipsText={t('caseEntity.details.diagLab_tooltips')} >
              <>todo</>
            </InformationField>

            {/* Aliquot */}
            <InformationField label={t('caseEntity.details.aliquot')}>
              <>todo</>
            </InformationField>

            {/* Run Name */}
            <InformationField label={t('caseEntity.details.run_name')}>
              <>todo</>
            </InformationField>

            {/* Run Alias */}
            <InformationField label={t('caseEntity.details.run_alias')}>
              <>todo</>
            </InformationField>

            {/* Run Date */}
            <InformationField label={t('caseEntity.details.run_date')}>
              <>todo</>
            </InformationField>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


function ActionsMenuCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);
  console.log('assayDialogOpen', assayDialogOpen);

  return (
    <>
      <div className="flex items-center justify-center">
        <AssayInformationsDialog open={assayDialogOpen} onClose={() => setAssayDialogOpen(false)} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              iconOnly
              variant="ghost"
              onClick={row.getToggleExpandedHandler()}
              className="text-muted-foreground size-6"
            >
              {<EllipsisVertical />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled={!row.original.has_variants}>
              <ExternalLink />
              {t('caseExploration.case.actions.view_variant')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setAssayDialogOpen(true); }}>
              <ExternalLink />
              {t('caseExploration.case.actions.view_assay')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div >
    </>
  );
}

export default ActionsMenuCell;
