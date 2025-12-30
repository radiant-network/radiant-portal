import { useState } from 'react';
import { Info } from 'lucide-react';

import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import SequencingInformationsDialog from 'components/base/sequencing/sequencing-information-dialog';

export type PreviewSheetSequencingExperimentDetailsProps = {
  patientId: number | undefined;
  relationshipToProband?: string;
  seqId: number | undefined;
};

function PreviewSheetSequencingExperimentDetails({
  patientId,
  relationshipToProband,
  seqId,
}: PreviewSheetSequencingExperimentDetailsProps) {
  const { t } = useI18n();
  const [sequencingExperimentDetailsDialogOpen, setSequencingExperimentDetailsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-10 items-center">
        <div className="flex flex-col items-start justify-center">
          <h4 className="font-semibold">{t('preview_sheet.occurrence_details.patient')}</h4>
          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground font-mono">{patientId}</p>
            {relationshipToProband && (
              <Badge variant="outline" className="bg-background">
                {relationshipToProband}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h4 className="font-semibold">{t('preview_sheet.occurrence_details.sequencing')}</h4>
          <div className="flex gap-1 items-center">
            <p className="text-muted-foreground font-mono">{seqId}</p>
            <Button
              variant="ghost"
              iconOnly
              className="size-6"
              onClick={() => setSequencingExperimentDetailsDialogOpen(true)}
            >
              <Info />
            </Button>
          </div>
        </div>
      </div>
      {seqId && (
        <SequencingInformationsDialog
          open={sequencingExperimentDetailsDialogOpen}
          onClose={() => setSequencingExperimentDetailsDialogOpen(false)}
          seqId={seqId.toString()}
        />
      )}
    </>
  );
}

export default PreviewSheetSequencingExperimentDetails;
