import { useCallback } from 'react';
import { MutationFetcher } from 'swr/mutation';

import { GermlineSNVOccurrence, InterpretationGermline, InterpretationSomatic } from '@/api/api';
import { interpretationApi } from '@/utils/api';

import { Interpretation } from './types';

export function useInterpretationHelper(caseId: number, occurrence: GermlineSNVOccurrence, isSomatic: boolean) {
  const fetch = useCallback(async () => {
    if (isSomatic) {
      return interpretationApi
        .getInterpretationSomatic(
          caseId.toString(),
          occurrence.seq_id!.toString(),
          occurrence.locus_id!.toString(),
          occurrence.transcript_id!,
        )
        .then(response => response.data);
    } else {
      return interpretationApi
        .getInterpretationGermline(
          caseId.toString(),
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
            caseId.toString(),
            occurrence.seq_id!.toString(),
            occurrence.locus_id!.toString(),
            occurrence.transcript_id!,
            options.arg as InterpretationSomatic,
          )
          .then(response => response.data);
      } else {
        return interpretationApi
          .postInterpretationGermline(
            caseId.toString(),
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
