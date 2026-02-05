import { useState } from 'react';
import { Info } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';
import { thousandNumberFormat } from '@/components/lib/number-format';

import SequencingInformationsDialog from '../sequencing/sequencing-information-dialog';
import { Badge } from '../shadcn/badge';
import { Button } from '../shadcn/button';

type SliderPatientRowProps = {
  patientId?: number;
  relationshipToProband?: string;
  seqId?: number;
};
function SliderPatientRow({ patientId, relationshipToProband, seqId }: SliderPatientRowProps) {
  const { t } = useI18n();
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-6 items-center">
        <div className="space-x-2">
          <span className="font-semibold">{t('preview_sheet.occurrence_details.patient')}</span>
          <span className="text-muted-foreground font-mono">{patientId && thousandNumberFormat(patientId)}</span>
          {relationshipToProband && (
            <Badge variant="outline" className="bg-background">
              {relationshipToProband}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <div className="space-x-2">
            <span className="font-semibold">{t('preview_sheet.occurrence_details.sequencing')}</span>
            <span className="text-muted-foreground font-mono">{seqId && thousandNumberFormat(seqId)}</span>
          </div>
          <Button
            variant="ghost"
            iconOnly
            className="size-6 text-muted-foreground"
            onClick={() => setAssayDialogOpen(true)}
          >
            <Info />
          </Button>
        </div>
      </div>
      {seqId && (
        <SequencingInformationsDialog
          open={assayDialogOpen}
          onClose={() => setAssayDialogOpen(false)}
          seqId={seqId.toString()}
        />
      )}
    </>
  );
}
export default SliderPatientRow;
