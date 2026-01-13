import { useCallback } from 'react';
import { MutationFetcher } from 'swr/mutation';

import { InterpretationGermline, InterpretationSomatic } from '@/api/api';
import { interpretationApi } from '@/utils/api';

import { Interpretation } from './types';

type useInterpretationHelperProps = {
  caseId: number;
  seqId?: number;
  locusId?: string;
  transcriptId?: string;
  isSomatic: boolean;
};

export function useInterpretationHelper({
  caseId,
  seqId,
  locusId,
  transcriptId,
  isSomatic,
}: useInterpretationHelperProps) {
  const fetch = useCallback(async () => {
    if (isSomatic) {
      return interpretationApi
        .getInterpretationSomatic(caseId.toString(), seqId!.toString(), locusId!, transcriptId!)
        .then(response => response.data);
    } else {
      return interpretationApi
        .getInterpretationGermline(caseId.toString(), seqId!.toString(), locusId!, transcriptId!)
        .then(response => response.data);
    }
  }, [isSomatic, seqId, locusId, transcriptId]);

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
            seqId!.toString(),
            locusId!,
            transcriptId!,
            options.arg as InterpretationSomatic,
          )
          .then(response => response.data);
      } else {
        return interpretationApi
          .postInterpretationGermline(
            caseId.toString(),
            seqId!.toString(),
            locusId!,
            transcriptId!,
            options.arg.interpretation as InterpretationGermline,
          )
          .then(response => response.data);
      }
    },
    [isSomatic, seqId, locusId, transcriptId],
  );

  return {
    fetch,
    save,
  };
}
