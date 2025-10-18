import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { Info } from 'lucide-react';
import { useState } from 'react';
import AssayInformationsDialog from '../assays/assay-information-dialog';

export type PreviewSheetAssayDetailsProps = {
  probandId: number | undefined;
  seqId: number | undefined;
};

function PreviewSheetAssayDetails({ probandId, seqId }: PreviewSheetAssayDetailsProps) {
  const [assayDialogOpen, setAssayDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className="flex gap-10 items-center">
        <div className="flex flex-col items-start justify-center">
          <h4 className="font-semibold">Patient</h4>
          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground font-mono">{probandId}</p>
            <Badge variant="outline" className="bg-background">
              Proband
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <h4 className="font-semibold">Assay</h4>
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
