import { useCallback } from 'react';

import { InterpretationPubmed } from '@/api/api';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/base/shadcn/dialog';
import { useI18n } from '@/components/hooks/i18n';
import { sequencingApi } from '@/utils/api';

type SequencingInput = {
  seqId: string;
};

export function useSequencingHelper(input: SequencingInput) {
  const fetchSequencingHelper = useCallback(
    async () => sequencingApi.getSequencingExperimentDetailById(input.seqId).then(response => response.data),
    [input],
  );

  return fetchSequencingHelper;
}

type PubmedListDialogProps = {
  pubmeds: InterpretationPubmed[];
  open: boolean;
  onClose: (value: boolean) => void;
};

function PubmedListDialog({ pubmeds, open, onClose }: PubmedListDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={(value: boolean) => onClose(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('pubmed_list_dialog.title')}</DialogTitle>
        </DialogHeader>

        {/* Status */}
        <DialogBody className="flex flex-col gap-6 w-full md:justify-between overflow-auto">
          {pubmeds.map(pubmed => (
            <div key={pubmed.citation_id}>
              <span className="mr-1">{pubmed.citation}</span>
              <AnchorLink
                variant="primary"
                target="_blank"
                href={`https://pubmed.ncbi.nlm.nih.gov/${pubmed.citation_id}`}
              >
                PMID:{pubmed.citation_id}
              </AnchorLink>
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => onClose(true)}>{t('common.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PubmedListDialog;
