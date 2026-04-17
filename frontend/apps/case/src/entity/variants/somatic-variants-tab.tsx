import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, CaseSequencingExperiment } from '@/api/api';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import { getDefaultSeqId, useSeqIdSearchParamsEffect } from './hooks/use-seqid-by-search';
import SNVTOTab from './somatic-occurrence/snv-to-tab';

export enum SomaticVariantInterface {
  SNV_TO = 'SNV_TO',
  SNV_TN = 'SNV_TN',
  CNV_TO = 'CNV_TO',
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function SomaticVariantsTab({ caseEntity, isLoading }: VariantTabProps) {
  const [searchParams] = useSearchParams();
  const [activeInterface, setActiveInterface] = useState<SomaticVariantInterface>(SomaticVariantInterface.SNV_TO);
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

  useSeqIdSearchParamsEffect({ seqId });

  // @TODO: to be changed when all tabs are implemented
  // options={Object.keys(SomaticVariantInterface)}
  return (
    <div className="bg-background flex flex-col">
      <SequencingExperimentVariantFilters
        isLoading={isLoading}
        sequencingExperiments={seqExpVariants}
        options={['SNV_TO']}
        selectedSeqId={seqId}
        handleChange={handlechange}
        activeInterface={activeInterface}
        onActiveInterfaceChange={value => {
          setActiveInterface(value as SomaticVariantInterface);
        }}
      />
      {activeInterface == SomaticVariantInterface.SNV_TO && (
        <SNVTOTab seqId={seqId} patientSelected={patientSelected} />
      )}
    </div>
  );
}

export default SomaticVariantsTab;
