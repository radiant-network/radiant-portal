import useSWR from 'swr';

import type { CNVGeneOverlap, CNVProfileSegment, GeneTrackGene } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { genesApi, occurrencesApi } from '@/utils/api';

import { GENE_TRACK_MAX_SPAN } from '../libs/traces';

import type { CNVProfileIds } from './use-profile-region';

type CNVGenes = { overlaps: CNVGeneOverlap[]; trackGenes: Record<string, GeneTrackGene> };

const EMPTY: CNVGenes = { overlaps: [], trackGenes: {} };

/**
 * The genes a CNV overlaps, as the overlapping genes of the CNV table give them, with their gene
 * track entries by gene id: their merged exons, to count the exons hit as the gene panel does. The
 * gene track stops at GENE_TRACK_MAX_SPAN, beyond which the genes have no track entry.
 */
export function useCNVGeneOverlaps({ caseId, seqId, taskId }: CNVProfileIds, segment: CNVProfileSegment) {
  const { tenant } = useTenant();
  const { data, isLoading } = useSWR<CNVGenes>(
    ['cnv-profile-cnv-genes', tenant, caseId, seqId, taskId, segment.cnv_id],
    async () => {
      const withTrack = segment.end - segment.start <= GENE_TRACK_MAX_SPAN;
      const [overlaps, track] = await Promise.all([
        occurrencesApi.listGermlineCNVGenesOverlap(tenant, caseId, seqId, taskId, segment.cnv_id),
        withTrack
          ? genesApi.geneTrack(tenant, undefined, segment.chromosome, segment.start, segment.end)
          : Promise.resolve(undefined),
      ]);
      return {
        overlaps: overlaps.data,
        trackGenes: Object.fromEntries((track?.data ?? []).map(gene => [gene.gene_id, gene])),
      };
    },
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  return { ...(data ?? EMPTY), isLoading };
}
