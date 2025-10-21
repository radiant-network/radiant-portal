import { useCallback, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';

import { CNVGeneOverlap, GermlineCNVOccurrence, SortBodyOrderEnum } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { valueToFileSize } from '@/components/base/information/document-size';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/ui/dialog';
import { useI18n } from '@/components/hooks/i18n';
import { occurrencesApi } from '@/utils/api';

import { SeqIDContext } from '../variants-tab';

import {
  defaultCNVOverlappingGenesSettings,
  getCNVOverlappingGenesColumns,
} from './table/cnv-overlapping-gene-table-settings';

const DEFAULT_SORTING = [
  {
    field: 'document_id',
    order: SortBodyOrderEnum.Desc,
  },
];

type OverlappingGenesInput = {
  seqId: string;
  cnvId: string;
};

type OverlappingGeneDialogProps = {
  occurrence: GermlineCNVOccurrence;
  children: React.ReactElement;
};

export function useCNVOverlappingGenesListHelper(input: OverlappingGenesInput) {
  const fetch = useCallback(
    async () => occurrencesApi.listGermlineCNVGenesOverlap(+input.seqId, input.cnvId).then(response => response.data),
    [input],
  );

  return {
    fetch,
  };
}

function OverlappingGeneDialog({ occurrence, children }: OverlappingGeneDialogProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState<boolean>(false);
  const seqId = useContext(SeqIDContext);

  const { fetch: fetchCNVOverlappingListHelper } = useCNVOverlappingGenesListHelper({
    seqId,
    cnvId: occurrence.cnv_id,
  });

  const fetchList = useSWR<CNVGeneOverlap[]>('fetch-overlapping-genes-list', fetchCNVOverlappingListHelper, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (open) fetchList.mutate();
  }, [open]);

  return (
    <Dialog onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[1050px] lg:min-w-[1250px] max-h-[calc(100vh-60px)] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {t('case_entity.variants.dialog.overlapping_gene', {
              type: occurrence.type,
              chromosome: occurrence.chromosome,
              start: occurrence.start,
              end: occurrence.end,
              length: valueToFileSize(occurrence.length),
            })}
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="min-w-full overflow-auto h-full">
          <DataTable
            id="overlapping-genes-table"
            columns={getCNVOverlappingGenesColumns(t)}
            defaultColumnSettings={defaultCNVOverlappingGenesSettings}
            defaultServerSorting={DEFAULT_SORTING}
            loadingStates={{
              total: fetchList.isLoading,
              list: fetchList.isLoading,
            }}
            pagination={{ pageIndex: 0, pageSize: 100 }}
            onPaginationChange={() => { }}
            data={fetchList?.data ?? []}
            hasError={!!fetchList.error}
            total={fetchList?.data?.length ?? 0}
            tableIndexResultPosition="top"
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
export default OverlappingGeneDialog;
