import { useCallback } from 'react';

import { CountBodyWithSqon, ListBodyWithSqon } from '@/api/api';
import { occurrencesApi } from '@/utils/api';

export type OccurrencesListInput = {
  seqId: string;
  listBody: ListBodyWithSqon;
};

export type OccurrenceCountInput = {
  seqId: string;
  countBody: CountBodyWithSqon;
};

export function useSNVOccurrencesCountHelper(input: OccurrenceCountInput) {
  const fetch = useCallback(
    async () =>
      occurrencesApi.countGermlineSNVOccurrences(input.seqId, input.countBody).then(response => response.data),
    [input],
  );

  return {
    fetch,
  };
}

export function useCNVOccurrencesListHelper(input: OccurrencesListInput) {
  const fetch = useCallback(
    async () => occurrencesApi.listGermlineCNVOccurrences(input.seqId, input.listBody).then(response => response.data),
    [input],
  );

  return {
    fetch,
  };
}

export function useCNVOccurrencesCountHelper(input: OccurrenceCountInput) {
  const fetch = useCallback(
    async () =>
      occurrencesApi.countGermlineCNVOccurrences(input.seqId, input.countBody).then(response => response.data),
    [input],
  );

  return {
    fetch,
  };
}
