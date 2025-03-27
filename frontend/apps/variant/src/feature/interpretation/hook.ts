import { InterpretationGermline, InterpretationSomatic, Occurrence } from '@/api/api';
import { interpretationApi } from '@/utils/api';
import { useCallback } from 'react';
import { MutationFetcher } from 'swr/mutation';
import { Interpretation } from './types';

export function useInterpretationHelper(occurence: Occurrence, isSomatic: boolean) {
  const fetch = useCallback(async () => {
    if (isSomatic) {
      return interpretationApi
        .getInterpretationSomatic(
          occurence.seq_id!.toString(),
          occurence.locus_id!.toString(),
          occurence.transcript_id!,
        )
        .then(response => response.data);
    } else {
      return interpretationApi
        .getInterpretationGermline(
          occurence.seq_id!.toString(),
          occurence.locus_id!.toString(),
          occurence.transcript_id!,
        )
        .then(response => response.data);
    }
  }, [isSomatic, occurence.seq_id, occurence.locus_id, occurence.transcript_id]);

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
            occurence.seq_id!.toString(),
            occurence.locus_id!.toString(),
            occurence.transcript_id!,
            options.arg as InterpretationSomatic,
          )
          .then(response => response.data);
      } else {
        return interpretationApi
          .postInterpretationGermline(
            occurence.seq_id!.toString(),
            occurence.locus_id!.toString(),
            occurence.transcript_id!,
            options.arg.interpretation as InterpretationGermline,
          )
          .then(response => response.data);
      }
    },
    [isSomatic, occurence.seq_id, occurence.locus_id, occurence.transcript_id],
  );

  return {
    fetch,
    save,
  };
}
