import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, CaseSequencingExperiment, CaseTasksWithOccurrencesDataTypeEnum } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { useOccurrenceTasks } from '@/components/hooks/use-occurrence-tasks';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import { getDefaultSeqId, useSeqIdSearchParamsEffect } from './hooks/use-seqid-by-search';
import { useTaskIdSearchParamsEffect } from './hooks/use-taskid-by-search';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const caseId = useCaseIdFromParam();
  const [activeInterface, setActiveInterface] = useState<SomaticVariantInterface>(SomaticVariantInterface.SNV_TN);
  const [patientSelected, setPatientSelected] = useState<CaseSequencingExperiment | undefined>(undefined);

  const [seqId, setSeqId] = useState<number>(getDefaultSeqId(searchParams.get('seq_id'), caseEntity));
  const seqExpVariants = caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants) ?? [];

  const { tasks, isLoading: isTasksLoading } = useOccurrenceTasks(
    caseId,
    seqId,
    CaseTasksWithOccurrencesDataTypeEnum.SomaticSnv,
  );
  const selectedTaskId = useTaskIdFromSearchParam();

  const handlechange = useCallback(
    (value: number) => {
      setSeqId(value);
      setPatientSelected(seqExpVariants.find(seqExp => seqExp.seq_id === value));
    },
    [seqExpVariants],
  );

  const handleTaskChange = useCallback(
    (value: number) => {
      searchParams.set('task_id', `${value}`);
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useSeqIdSearchParamsEffect({ seqId, setSeqId, caseEntity });
  useTaskIdSearchParamsEffect({ tasks, isLoading: isTasksLoading });

  // @TODO: to be changed when all tabs are implemented
  // options={Object.keys(SomaticVariantInterface)}
  return (
    <div className="bg-background flex flex-col">
      <SequencingExperimentVariantFilters
        isLoading={isLoading}
        sequencingExperiments={seqExpVariants}
        options={[
          {
            value: SomaticVariantInterface.SNV_TN,
            tooltip: t(`case_entity.variants.filters.snv_tn_tooltip`),
          },
        ]}
        selectedSeqId={seqId}
        handleChange={handlechange}
        activeInterface={activeInterface}
        onActiveInterfaceChange={value => {
          setActiveInterface(value as SomaticVariantInterface);
        }}
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onTaskChange={handleTaskChange}
      />
      {activeInterface == SomaticVariantInterface.SNV_TN && (
        <SNVTumorNormalTab seqId={seqId} patientSelected={patientSelected} caseEntity={caseEntity} />
      )}
    </div>
  );
}

export default SomaticVariantsTab;
