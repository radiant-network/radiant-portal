import { useCallback, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { CNVGeneOverlap, GermlineCNVOccurrence } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/shadcn/dialog';
import { useI18n } from '@/components/hooks/i18n';
import { toKiloBases } from '@/components/lib/number-format';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

import { useSeqIdContext } from './hooks/use-seq-id';
import {
  defaultCNVOverlappingGenesSettings,
  getCNVOverlappingGenesColumns,
} from './table/cnv-overlapping-gene-table-settings';

type OverlappingGenesInput = {
  caseId: number;
  seqId: number;
  cnvId: string;
};

type OverlappingGeneDialogProps = {
  occurrence: GermlineCNVOccurrence;
  children: React.ReactElement;
};

export function useCNVOverlappingGenesListHelper(input: OverlappingGenesInput) {
  const fetch = useCallback(
    async () =>
      occurrencesApi
        .listGermlineCNVGenesOverlap(input.caseId, input.seqId, input.cnvId)
        .then(response => response.data),
    [input],
  );

  return {
    fetch,
  };
}

function OverlappingGeneDialog({ occurrence, children }: OverlappingGeneDialogProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState<boolean>(false);
  const seqId = useSeqIdContext();

  const caseId = useCaseIdFromParam();

  const { fetch: fetchCNVOverlappingListHelper } = useCNVOverlappingGenesListHelper({
    caseId,
    seqId,
    cnvId: occurrence.cnv_id,
  });

  const fetchList = useSWR<CNVGeneOverlap[]>(
    `fetch-overlapping-genes-list-${seqId}-${occurrence.cnv_id}`,
    fetchCNVOverlappingListHelper,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (open) fetchList.mutate();
  }, [open]);

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent size="full" className="flex flex-col">
        {open && (
          <>
            <DialogHeader>
              <DialogTitle>
                {t('case_entity.variants.dialog.overlapping_gene', {
                  type: occurrence.type,
                  chromosome: occurrence.chromosome,
                  start: occurrence.start,
                  end: occurrence.end,
                  length: toKiloBases(occurrence.length),
                })}
              </DialogTitle>
            </DialogHeader>
            <DialogBody className="flex-1 overflow-auto">
              <DataTable
                id="overlapping-genes-table"
                columns={getCNVOverlappingGenesColumns(t)}
                className="h-full"
                defaultColumnSettings={defaultCNVOverlappingGenesSettings}
                loadingStates={{
                  total: fetchList.isLoading,
                  list: fetchList.isLoading,
                }}
                pagination={{ type: 'locale', state: { pageIndex: 0, pageSize: 100 } }}
                data={fetchList?.data ?? []}
                hasError={!!fetchList.error}
                total={fetchList?.data?.length ?? 0}
                tableIndexResultPosition="top"
              />
            </DialogBody>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default OverlappingGeneDialog;
