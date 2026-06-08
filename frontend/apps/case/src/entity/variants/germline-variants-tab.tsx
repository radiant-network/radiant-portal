import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CaseEntity, CaseSequencingExperiment, CaseTasksWithOccurrencesDataTypeEnum } from '@/api/api';
import { useOccurrenceTasks } from '@/components/hooks/use-occurrence-tasks';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import CNVTab from './germline-occurrence/cnv-tab';
import SNVTab from './germline-occurrence/snv-tab';
import { getDefaultSeqId, useVariantSearchParamsEffect } from './hooks/use-variant-search-params';

export enum GermlineVariantInterface {
  SNV = 'SNV',
  CNV = 'CNV',
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function GermlineVariantsTab({ caseEntity, isLoading }: VariantTabProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const caseId = useCaseIdFromParam();
  const [activeInterface, setActiveInterface] = useState<GermlineVariantInterface>(GermlineVariantInterface.SNV);
  const [patientSelected, setPatientSelected] = useState<CaseSequencingExperiment | undefined>(undefined);

  const [seqId, setSeqId] = useState<number>(getDefaultSeqId(searchParams.get('seq_id'), caseEntity));
  const seqExpVariants = caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants) ?? [];

  const dataType =
    activeInterface === GermlineVariantInterface.CNV
      ? CaseTasksWithOccurrencesDataTypeEnum.GermlineCnv
      : CaseTasksWithOccurrencesDataTypeEnum.GermlineSnv;
  const { tasks, isLoading: isTasksLoading } = useOccurrenceTasks(caseId, seqId, dataType);
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

  useVariantSearchParamsEffect({ seqId, setSeqId, caseEntity, tasks, isLoading: isTasksLoading });

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
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onTaskChange={handleTaskChange}
      />
      {activeInterface == GermlineVariantInterface.SNV && (
        <SNVTab seqId={seqId} patientSelected={patientSelected} caseEntity={caseEntity} />
      )}
      {activeInterface == GermlineVariantInterface.CNV && <CNVTab seqId={seqId} caseEntity={caseEntity} />}
    </div>
  );
}

export default GermlineVariantsTab;
