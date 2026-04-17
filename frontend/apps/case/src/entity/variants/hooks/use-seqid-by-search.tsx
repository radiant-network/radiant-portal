import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity } from '@/api/api';
import { CaseEntityTabs } from '@/types';

/**
 * Utils function to setup default seqId value on load
 */
export function getDefaultSeqId(searchParamSeqId: string | null, caseEntity?: CaseEntity) {
  // only use sequencing experiments with variants
  const sequencingExperimentsWithVariants =
    caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants) ?? [];

  let defaultSeqId = searchParamSeqId != null ? Number(searchParamSeqId) : -1;

  if (defaultSeqId < 0 && sequencingExperimentsWithVariants[0]?.seq_id) {
    defaultSeqId = sequencingExperimentsWithVariants[0]?.seq_id;
  }

  return defaultSeqId;
}

type UseSeqIdSearchEffectProps = {
  seqId: number;
};

/**
 * Update url based on seqId value
 *
 * seqId is used to update SequencingExperimentVariantFilters value
 */
export function useSeqIdSearchParamsEffect({ seqId }: UseSeqIdSearchEffectProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tab') == CaseEntityTabs.Variants) {
      searchParams.set('seq_id', `${seqId}`);
      setSearchParams(searchParams, { replace: true });
    }
  }, [seqId]);

  useEffect(() => {
    if (searchParams.get('tab') == CaseEntityTabs.Variants) {
      searchParams.set('seq_id', `${seqId}`);
      setSearchParams(searchParams, { replace: true });
      return;
    }
  }, [searchParams.get('tab')]);
}
