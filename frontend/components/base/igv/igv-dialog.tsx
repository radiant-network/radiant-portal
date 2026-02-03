import { ReactNode, useEffect } from 'react';
import useSWR from 'swr';

import { IGVTracks } from '@/api/api';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/base/shadcn/dialog';
import { Spinner } from '@/components/base/spinner';
import { useI18n } from '@/components/hooks/i18n';
import { igvApi } from '@/utils/api';

import IgvContainer from './igv-container';

type IGVDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  caseId: number;
  seqId: number;
  locus: string;
  start: number;
  chromosome: string;
  renderTrigger?: (handleOpen: () => void) => ReactNode;
};

const fetchIGVForCaseId = async ({ caseId }: { caseId: number }) =>
  igvApi.getIGV(caseId.toString()).then(response => response.data);

const IGVDialog = ({ caseId, seqId, locus, start, chromosome, open, setOpen, renderTrigger }: IGVDialogProps) => {
  const { t } = useI18n();
  const fetchIGV = useSWR<IGVTracks>(
    {
      key: `igv-${caseId}-${seqId}-${locus}`,
      caseId: caseId,
    },
    fetchIGVForCaseId,
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
      <DialogContent size="full" variant="stickyHeader">
        {fetchIGV.isLoading ? (
          <DialogBody className="flex items-center justify-center">
            <Spinner size={32} />
          </DialogBody>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle>{t('variant.igv.title')}</DialogTitle>
            </DialogHeader>
            <DialogBody className="relative max-h-[85vh] overflow-y-auto">
              <IgvContainer tracks={fetchIGV.data?.alignment || []} locus={formatLocus(start, chromosome, 100)} />
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
