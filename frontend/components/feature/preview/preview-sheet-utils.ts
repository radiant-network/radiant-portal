import useSWR from 'swr';

import { CaseEntity, ExpandedGermlineSNVOccurrence } from '@/api/api';
import { PROBAND } from '@/components/feature/constants';
import { caseApi, occurrencesApi } from '@/utils/api';

export type OccurrenceExpandInput = {
  caseId: string;
  seqId: string;
  locusId: string;
};

export type CaseInput = {
  key: string;
  caseId: any | undefined;
};

export async function fetchOccurrenceExpand(input: OccurrenceExpandInput) {
  const response = await occurrencesApi.getExpandedGermlineSNVOccurrence(input.caseId, input.seqId, input.locusId);
  return response.data;
}

export async function fetchCase(input: CaseInput) {
  if (!input.caseId) {
    return null;
  }

  const response = await caseApi.caseEntity(input.caseId);
  return response.data;
}

/**
 * Hook to fetch occurrence and case data for preview sheets
 */
export function useOccurrenceAndCase(caseId: string, seqId: string, locusId: string) {
  const expandResult = useSWR<ExpandedGermlineSNVOccurrence, any, OccurrenceExpandInput>(
    {
      caseId: caseId,
      locusId: locusId,
      seqId: seqId,
    },
    fetchOccurrenceExpand,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const caseResult = useSWR<CaseEntity | null, any, CaseInput>(
    {
      key: 'case-entity',
      caseId: caseId,
    },
    fetchCase,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const proband = caseResult.data?.members.find(member => member.relationship_to_proband === PROBAND);
  const assay = caseResult.data?.assays.find(assay => assay.patient_id === proband?.patient_id);

  return {
    expandResult,
    caseResult,
    proband,
    assay,
    isLoading: expandResult.isLoading || !expandResult.data || caseResult.isLoading || !caseResult.data,
  };
}
