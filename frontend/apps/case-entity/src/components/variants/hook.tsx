import { CountBodyWithSqon, ListBodyWithSqon } from "@/api/api";
import { occurrencesApi } from "@/utils/api";
import { useCallback } from "react";


export type OccurrencesListInput = {
  seqId: string;
  listBody: ListBodyWithSqon;
};

export type OccurrenceCountInput = {
  seqId: string;
  countBody: CountBodyWithSqon;
};

export function useOccurencesListHelper(input: OccurrencesListInput) {
  const fetch = useCallback(async () => {
    return occurrencesApi.listGermlineOccurrences(input.seqId, input.listBody)
      .then(response => response.data);
  }, [input]);

  return {
    fetch,
  };
}


export function useOccurencesCountHelper(input: OccurrenceCountInput) {
  const fetch = useCallback(async () => {
    return occurrencesApi.countGermlineOccurrences(input.seqId, input.countBody)
      .then(response => response.data);
  }, [input]);

  return {
    fetch,
  };
}
