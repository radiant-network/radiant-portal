import useSWR from 'swr';

import type { CNVProfileRegion } from '@/api/api';
import { useTenant } from '@/components/hooks/use-tenant';
import { useDebounce } from '@/components/hooks/useDebounce';
import { occurrencesApi } from '@/utils/api';

import type { Locus } from '../libs/genome';

export type CNVProfileIds = { caseId: number; seqId: number; taskId: number };

export function useProfileRegion({ caseId, seqId, taskId }: CNVProfileIds, region?: Locus) {
  const { tenant } = useTenant();
  const settled = useDebounce(region, 300);
  const { data, isLoading } = useSWR<CNVProfileRegion>(
    settled
      ? ['cnv-profile-region', tenant, caseId, seqId, taskId, settled.chromosome, settled.start, settled.end]
      : null,
    async () => {
      const response = await occurrencesApi.getGermlineCNVProfileRegion(
        tenant,
        caseId,
        seqId,
        taskId,
        settled!.chromosome,
        settled!.start,
        settled!.end,
      );
      return response.data;
    },
    { revalidateOnFocus: false, keepPreviousData: true },
  );
  return { region: region ? data : undefined, isLoading: region !== undefined && isLoading };
}
