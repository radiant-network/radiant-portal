import { InterpretationGermline, InterpretationSomatic, GermlineSNVOccurrence } from '@/api/api';
import { interpretationApi, occurrencesApi } from '@/utils/api';
import { useCallback } from 'react';
import { MutationFetcher } from 'swr/mutation';
import { Interpretation } from './types';

export function useInterpretationHelper(occurrence: GermlineSNVOccurrence, isSomatic: boolean) {
  const fetch = useCallback(async () => {
    if (isSomatic) {
      return interpretationApi
        .getInterpretationSomatic(
          occurrence.seq_id!.toString(),
          occurrence.locus_id!.toString(),
          occurrence.transcript_id!,
        )
        .then(response => response.data);
    } else {
      return interpretationApi
        .getInterpretationGermline(
          occurrence.seq_id!.toString(),
          occurrence.locus_id!.toString(),
          occurrence.transcript_id!,
        )
        .then(response => response.data);
    }
  }, [isSomatic, occurrence.seq_id, occurrence.locus_id, occurrence.transcript_id]);

  const save: MutationFetcher<
    Interpretation,
    string,
    {
      interpretation: Interpretation;
    }
  > = useCallback(
    async (_key: string, options): Promise<Interpretation> => {
      if (isSomatic) {
        return interpretationApi
          .postInterpretationSomatic(
            occurrence.seq_id!.toString(),
            occurrence.locus_id!.toString(),
            occurrence.transcript_id!,
            options.arg as InterpretationSomatic,
          )
          .then(response => response.data);
      } else {
        return interpretationApi
          .postInterpretationGermline(
            occurrence.seq_id!.toString(),
            occurrence.locus_id!.toString(),
            occurrence.transcript_id!,
            options.arg.interpretation as InterpretationGermline,
          )
          .then(response => response.data);
      }
    },
    [isSomatic, occurrence.seq_id, occurrence.locus_id, occurrence.transcript_id],
  );

  return {
    fetch,
    save,
  };
}


export function useOccurenceExpandHelper(occurrence: GermlineSNVOccurrence) {
  const fetch = useCallback(async () => {
    return occurrencesApi.getExpandedGermlineSNVOccurrence(
      occurrence.seq_id!.toString(),
      occurrence.locus_id!.toString(),
    )
      .then(response => response.data);
  }, [occurrence.seq_id, occurrence.locus_id]);

  return {
    fetch,
  };
}
