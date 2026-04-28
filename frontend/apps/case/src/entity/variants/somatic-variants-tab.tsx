import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, CaseSequencingExperiment } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import { getDefaultSeqId, useSeqIdSearchParamsEffect } from './hooks/use-seqid-by-search';
import SNVTumorNormalTab from './somatic-occurrence/snv-tumor-normal-tab';

export enum SomaticVariantInterface {
  SNV_TN = 'SNV_TN',
  SNV_TO = 'SNV_TO',
  CNV_TO = 'CNV_TO',
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function SomaticVariantsTab({ caseEntity, isLoading }: VariantTabProps) {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [activeInterface, setActiveInterface] = useState<SomaticVariantInterface>(SomaticVariantInterface.SNV_TN);
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

  // @TODO: to be changed when all tabs are implemented
  // options={Object.keys(SomaticVariantInterface)}
  return (
    <div className="bg-background flex flex-col">
      <SequencingExperimentVariantFilters
        isLoading={isLoading}
        sequencingExperiments={seqExpVariants}
        options={[
          {
            value: 'SNV_TN',
            tooltip: t(`case_entity.variants.filters.snv_tn_tooltip`),
          },
        ]}
        selectedSeqId={seqId}
        handleChange={handlechange}
        activeInterface={activeInterface}
        onActiveInterfaceChange={value => {
          setActiveInterface(value as SomaticVariantInterface);
        }}
      />
      {activeInterface == SomaticVariantInterface.SNV_TN && (
        <SNVTumorNormalTab seqId={seqId} patientSelected={patientSelected} caseEntity={caseEntity} />
      )}
    </div>
  );
}

export default SomaticVariantsTab;
