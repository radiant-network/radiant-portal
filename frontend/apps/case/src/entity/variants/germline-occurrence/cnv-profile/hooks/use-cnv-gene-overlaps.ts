import useSWR from 'swr';

import type { CNVGeneOverlap, CNVProfileSegment } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { occurrencesApi } from '@/utils/api';

import type { CNVProfileIds } from './use-profile-region';

/**
 * The genes a CNV overlaps, as the overlapping genes of the CNV table give them. Their nb_exons
 * counts the exons the CNV hits merged over the transcripts, as the gene track draws them.
 */
export function useCNVGeneOverlaps({ caseId, seqId, taskId }: CNVProfileIds, segment: CNVProfileSegment) {
  const { tenant } = useTenant();
  const { data, isLoading } = useSWR<CNVGeneOverlap[]>(
    ['cnv-profile-cnv-genes', tenant, caseId, seqId, taskId, segment.cnv_id],
    async () => {
      const response = await occurrencesApi.listGermlineCNVGenesOverlap(tenant, caseId, seqId, taskId, segment.cnv_id);
      return response.data;
    },
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  return { overlaps: data ?? [], isLoading };
}
