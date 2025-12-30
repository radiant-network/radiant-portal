import useSWR from 'swr';

import {
  CaseEntity,
  CasePatientClinicalInformation,
  CaseSequencingExperiment,
  ExpandedGermlineSNVOccurrence,
} from '@/api/api';
import { PROBAND } from '@/components/base/constants';
import { caseApi, occurrencesApi } from '@/utils/api';

export type OccurrenceExpandInput = {
  caseId: number;
  seqId: number;
  locusId: string;
};

export type CaseInput = {
  key: string;
  caseId: number;
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
export function useOccurrenceAndCase(
  caseId: number,
  seqId: number,
  locusId: string,
  patientSelected?: CaseSequencingExperiment,
) {
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

  let patient: CasePatientClinicalInformation | undefined;
  let caseSequencing: CaseSequencingExperiment | undefined;
  if (patientSelected) {
    patient = caseResult.data?.members.find(member => member.patient_id === patientSelected.patient_id);
    caseSequencing = caseResult.data?.sequencing_experiments.find(
      seqExp => seqExp.patient_id === patientSelected.patient_id,
    );
  } else {
    patient = caseResult.data?.members.find(member => member.relationship_to_proband === PROBAND);
    caseSequencing = caseResult.data?.sequencing_experiments.find(seqExp => seqExp.patient_id === patient?.patient_id);
  }

  return {
    expandResult,
    caseResult,
    patient,
    caseSequencing,
    isLoading: expandResult.isLoading || !expandResult.data || caseResult.isLoading || !caseResult.data,
  };
}

/**
 * Hook to fetch case data for preview sheets
 */
export function useCase(caseId: number, seqId: number, locusId: string) {
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

  return {
    expandResult,
    caseResult,
    isLoading: expandResult.isLoading || !expandResult.data || caseResult.isLoading || !caseResult.data,
  };
}
