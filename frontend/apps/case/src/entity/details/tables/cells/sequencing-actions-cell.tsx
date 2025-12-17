import { useState } from 'react';
import { CellContext } from '@tanstack/react-table';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import SequencingInformationsDialog from 'components/base/sequencing/sequencing-information-dialog';

function SequencingActionsCell({ row }: CellContext<any, any>) {
  const { t } = useI18n();
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <SequencingInformationsDialog
          open={assayDialogOpen}
          onClose={() => setAssayDialogOpen(false)}
          seqId={row.original.seq_id}
        />
        <Button
          onClick={() => {
            setAssayDialogOpen(true);
          }}
          variant="outline"
          size="xxs"
        >
          {t('case_entity.details.sequencing_details')}
        </Button>
      </div>
    </>
  );
}

export default SequencingActionsCell;
