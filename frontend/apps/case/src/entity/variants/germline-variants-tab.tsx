import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, CaseSequencingExperiment } from '@/api/api';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import CNVTab from './germline-occurrence/cnv-tab';
import SNVTab from './germline-occurrence/snv-tab';
import { getDefaultSeqId, useSeqIdSearchParamsEffect } from './hooks/use-seqid-by-search';

export enum GermlineVariantInterface {
  SNV = 'SNV',
  CNV = 'CNV',
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function GermlineVariantsTab({ caseEntity, isLoading }: VariantTabProps) {
  const [searchParams] = useSearchParams();
  const [activeInterface, setActiveInterface] = useState<GermlineVariantInterface>(GermlineVariantInterface.SNV);
  const [patientSelected, setPatientSelected] = useState<CaseSequencingExperiment | undefined>(undefined);

  const [seqId, setSeqId] = useState<number>(getDefaultSeqId(searchParams.get('seq_id'), caseEntity));
  const seqExpVariants = caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants) ?? [];

  const handlechange = useCallback(
    (value: number) => {
      setSeqId(value);
      setPatientSelected(seqExpVariants.find(seqExp => seqExp.seq_id === value));
    },
    [seqExpVariants],
  );

  useSeqIdSearchParamsEffect({ seqId, setSeqId, caseEntity });

  return (
    <div className="bg-background flex flex-col">
      <SequencingExperimentVariantFilters
        isLoading={isLoading}
        sequencingExperiments={seqExpVariants}
        selectedSeqId={seqId}
        options={Object.keys(GermlineVariantInterface).map(key => ({
          value: key,
        }))}
        handleChange={handlechange}
        activeInterface={activeInterface}
        onActiveInterfaceChange={value => {
          setActiveInterface(value as GermlineVariantInterface);
        }}
      />
      {activeInterface == GermlineVariantInterface.SNV && (
        <SNVTab seqId={seqId} patientSelected={patientSelected} caseEntity={caseEntity} />
      )}
      {activeInterface == GermlineVariantInterface.CNV && <CNVTab seqId={seqId} />}
    </div>
  );
}

export default GermlineVariantsTab;
