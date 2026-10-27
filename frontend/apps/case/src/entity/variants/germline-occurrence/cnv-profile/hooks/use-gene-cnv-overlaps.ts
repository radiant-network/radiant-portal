import useSWR from 'swr';

import type { CNVGeneOverlap, CNVProfileSegment, GeneTrackGene } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { occurrencesApi } from '@/utils/api';

import type { CNVProfileIds } from './use-profile-region';

const EMPTY: Record<string, CNVGeneOverlap> = {};

/**
 * How each CNV overlaps a gene, by CNV id, as the overlapping genes of the CNV table give it: the
 * API computes it per CNV, over every transcript of the gene.
 */
export function useGeneCNVOverlaps(
  { caseId, seqId, taskId }: CNVProfileIds,
  gene: GeneTrackGene,
  cnvs: CNVProfileSegment[],
) {
  const { tenant } = useTenant();
  const cnvIds = cnvs.map(cnv => cnv.cnv_id);
  const { data, isLoading } = useSWR<Record<string, CNVGeneOverlap>>(
    cnvIds.length > 0 ? ['cnv-profile-gene-overlaps', tenant, caseId, seqId, taskId, gene.gene_id, ...cnvIds] : null,
    async () => {
      const overlaps = await Promise.all(
        cnvIds.map(async cnvId => {
          const response = await occurrencesApi.listGermlineCNVGenesOverlap(tenant, caseId, seqId, taskId, cnvId);
          return [cnvId, response.data.find(overlap => overlap.gene_id === gene.gene_id)] as const;
        }),
      );
      return Object.fromEntries(overlaps.filter(([, overlap]) => overlap !== undefined)) as Record<
        string,
        CNVGeneOverlap
      >;
    },
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  return { overlaps: data ?? EMPTY, isLoading };
}
