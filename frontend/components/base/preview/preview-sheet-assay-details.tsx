import { useState } from 'react';
import { Info } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

import AssayInformationsDialog from '../assays/assay-information-dialog';

export type PreviewSheetAssayDetailsProps = {
  patientId: number | undefined;
  relationshipToProband?: string;
  seqId: number | undefined;
};

function PreviewSheetAssayDetails({ patientId, relationshipToProband, seqId }: PreviewSheetAssayDetailsProps) {
  const { t } = useI18n();
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-10 items-center">
        <div className="flex flex-col items-start justify-center">
          <h4 className="font-semibold">{t('preview_sheet.occurrence_details.patient')}</h4>
          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground font-mono">{patientId}</p>
            <Badge variant="outline" className="bg-background">
              {relationshipToProband}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h4 className="font-semibold">{t('preview_sheet.occurrence_details.assay')}</h4>
          <div className="flex gap-1 items-center">
            <p className="text-muted-foreground font-mono">{seqId}</p>
            <Button variant="ghost" iconOnly className="size-6" onClick={() => setAssayDialogOpen(true)}>
              <Info />
            </Button>
          </div>
        </div>
      </div>
      {seqId && (
        <AssayInformationsDialog
          open={assayDialogOpen}
          onClose={() => setAssayDialogOpen(false)}
          seqId={seqId.toString()}
        />
      )}
    </>
  );
}

export default PreviewSheetAssayDetails;
