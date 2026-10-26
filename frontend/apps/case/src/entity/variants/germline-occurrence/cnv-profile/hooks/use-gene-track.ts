import useSWR from 'swr';

import type { GeneTrackGene } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { useDebounce } from '@/components/hooks/useDebounce';
import { genesApi } from '@/utils/api';

import type { Locus } from '../libs/genome';

const EMPTY: GeneTrackGene[] = [];

/**
 * The genes of a region, fetched once the view settles. The previous genes stay shown while the
 * next region loads.
 */
export function useGeneTrack(region?: Locus) {
  const { tenant } = useTenant();
  const settled = useDebounce(region, 200);
  const { data, isLoading } = useSWR<GeneTrackGene[]>(
    settled ? ['cnv-profile-gene-track', tenant, settled.chromosome, settled.start, settled.end] : null,
    async () => {
      const response = await genesApi.geneTrack(tenant, undefined, settled!.chromosome, settled!.start, settled!.end);
      return response.data;
    },
    { revalidateOnFocus: false, keepPreviousData: true },
  );
  return { genes: region ? (data ?? EMPTY) : EMPTY, isLoading };
}
