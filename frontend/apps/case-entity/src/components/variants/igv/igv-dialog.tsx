import { ReactNode, useEffect } from 'react';
import useSWR from 'swr';

import { GermlineSNVOccurrence, IGVTracks } from '@/api/api';
import { Spinner } from '@/components/base/spinner';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/base/ui/dialog';
import { useI18n } from '@/components/hooks/i18n';
import { igvApi } from '@/utils/api';

import IgvContainer from './igv-container';

type IGVDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  occurrence: GermlineSNVOccurrence;
  renderTrigger?: (handleOpen: () => void) => ReactNode;
};

const fetchIGVForSeqId = async ({ seqId }: { seqId: number }) =>
  igvApi.getIGV(seqId.toString()).then(response => response.data);

const IGVDialog = ({ occurrence, open, setOpen, renderTrigger }: IGVDialogProps) => {
  const { t } = useI18n();
  const fetchIGV = useSWR<IGVTracks>(
    {
      key: `igv-${occurrence.seq_id}-${occurrence.locus}`,
      seqId: occurrence.seq_id,
    },
    fetchIGVForSeqId,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (open) {
      fetchIGV.mutate();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger?.(() => setOpen(true))}
      <DialogContent className="max-w-[calc(100vw-60px)] min-h-[calc(100vh-60px)] w-[1200px]">
        {fetchIGV.isLoading ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>{t('variant.igv.title')}</DialogTitle>
            </DialogHeader>
            <DialogBody className="relative">
              <IgvContainer
                tracks={fetchIGV.data?.alignment || []}
                locus={formatLocus(occurrence.start, occurrence.chromosome, 100)}
              />
            </DialogBody>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const formatLocus = (start: number, chromosome: string, bound?: number, end?: number) =>
  `chr${chromosome}:${bound ? `${start - bound}-${end ? end + bound : start + bound}` : start}`;

export default IGVDialog;
