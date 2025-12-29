import { createContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, CaseSequencingExperiment } from '@/api/api';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import CNVTab from './occurrence/cnv-tab';
import SNVTab from './occurrence/snv-tab';

export const SeqIDContext = createContext<number>(-1);

export enum VariantInterface {
  SNV = 'snv',
  CNV = 'cnv',
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function VariantTab({ caseEntity, isLoading }: VariantTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeInterface, setActiveInterface] = useState<VariantInterface>(VariantInterface.SNV);
  const [patientSelected, setPatientSelected] = useState<CaseSequencingExperiment | undefined>(undefined);

  // only use sequencing experiments with variants
  const sequencingExperimentsWithVariants =
    caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants) ?? [];

  let defaultSeqId = Number(searchParams.get('seq_id')) ?? -1;
  if (!defaultSeqId && sequencingExperimentsWithVariants[0]?.seq_id) {
    defaultSeqId = sequencingExperimentsWithVariants[0]?.seq_id;
  }
  const [seqId, setSeqId] = useState<number>(defaultSeqId);

  /**
   * Set proband based on searchParams
   */
  useEffect(() => {
    if (searchParams.get('seq_id') != null) {
      setSeqId(Number(searchParams.get('seq_id')) ?? -1);
      return;
    }

    const sequencing_experiments = caseEntity?.sequencing_experiments ?? [];
    if (sequencing_experiments.length === 0) return;

    const sequencingExperimentsWithVariants = sequencing_experiments.filter(seqExp => seqExp.has_variants);
    if (sequencingExperimentsWithVariants.length === 0) return;

    setSeqId(sequencingExperimentsWithVariants[0].seq_id);
  }, [searchParams, caseEntity]);

  return (
    <SeqIDContext value={seqId}>
      <div className="bg-background flex flex-col">
        <SequencingExperimentVariantFilters
          isLoading={isLoading}
          sequencingExperiments={sequencingExperimentsWithVariants}
          value={seqId}
          handleChange={(value: number) => {
            searchParams.set('seq_id', `${value}`);
            setSearchParams(searchParams, { replace: true });
            setSeqId(value);
            setPatientSelected(sequencingExperimentsWithVariants.find(seqExp => seqExp.seq_id === value));
          }}
          activeInterface={activeInterface}
          onActiveInterfaceChange={setActiveInterface}
        />

        {activeInterface == VariantInterface.SNV && <SNVTab seqId={seqId} patientSelected={patientSelected} />}
        {activeInterface == VariantInterface.CNV && <CNVTab seqId={seqId} />}
      </div>
    </SeqIDContext>
  );
}

export default VariantTab;
