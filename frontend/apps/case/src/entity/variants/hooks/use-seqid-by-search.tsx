import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity } from '@/api/api';
import { CaseEntityTabs } from '@/types';

/**
 * Utils function to setup default seqId value on load
 */
export function getDefaultSeqId(searchParamSeqId: string | null, caseEntity?: CaseEntity) {
  // only use sequencing experiments with variants
  const validSeqIds =
    caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants).map(seqExp => seqExp.seq_id) ?? [];

  let defaultSeqId = searchParamSeqId != null ? Number(searchParamSeqId) : -1;

  if (validSeqIds.length > 0 && !validSeqIds.includes(defaultSeqId)) {
    defaultSeqId = validSeqIds[0];
  }

  return defaultSeqId;
}

type UseSeqIdSearchEffectProps = {
  seqId: number;
  setSeqId: (value: number) => void;
  caseEntity?: CaseEntity;
};

/**
 * Update url based on seqId value
 *
 * seqId is used to update SequencingExperimentVariantFilters value
 */
export function useSeqIdSearchParamsEffect({ seqId, setSeqId, caseEntity }: UseSeqIdSearchEffectProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tab') == CaseEntityTabs.Variants) {
      searchParams.set('seq_id', `${seqId}`);
      setSearchParams(searchParams, { replace: true });
    }
  }, [seqId, searchParams.get('tab')]);

  useEffect(() => {
    const searchParamSeqId = Number(searchParams.get('seq_id'));
    const validSeqIds =
      caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants).map(seqExp => seqExp.seq_id) ?? [];

    if (validSeqIds.length > 0 && !validSeqIds.includes(searchParamSeqId)) {
      setSeqId(validSeqIds[0]);
    }
  }, [caseEntity]);
}
