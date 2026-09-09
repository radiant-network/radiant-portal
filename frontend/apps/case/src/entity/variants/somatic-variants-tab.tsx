import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
  type CaseEntity,
  type CaseSequencingExperiment,
  CaseTasksWithOccurrencesDataTypeEnum,
  type TaskOccurrenceType,
} from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { useOccurrenceTasks } from '@/components/hooks/use-occurrence-tasks';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import SequencingExperimentVariantFilters from './filters/sequencing-experiment-variant-filters';
import {
  getDefaultSeqId,
  useVariantSearchParamsEffect,
  VARIANT_SECTION_PARAM,
} from './hooks/use-variant-search-params';
import SomaticSNVTab from './somatic-occurrence/somatic-snv-tab';
import { SomaticVariantInterface } from './constants';

/** Value each sub-tab takes in the `variant_section` URL param. */
const VARIANT_SECTIONS: Record<SomaticVariantInterface, string> = {
  [SomaticVariantInterface.SNV_TN]: 'snv-tn',
  [SomaticVariantInterface.SNV_TO]: 'snv-to',
  [SomaticVariantInterface.CNV_TO]: 'cnv-to',
};

function getInterfaceFromVariantSection(section: string | null) {
  return (Object.keys(VARIANT_SECTIONS) as SomaticVariantInterface[]).find(key => VARIANT_SECTIONS[key] === section);
}

type VariantTabProps = {
  caseEntity?: CaseEntity;
  isLoading: boolean;
};

function SomaticVariantsTab({ caseEntity, isLoading }: VariantTabProps) {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const caseId = useCaseIdFromParam();
  const [activeInterface, setActiveInterface] = useState<SomaticVariantInterface | undefined>(
    getInterfaceFromVariantSection(searchParams.get(VARIANT_SECTION_PARAM)),
  );
  const [patientSelected, setPatientSelected] = useState<CaseSequencingExperiment | undefined>(undefined);

  const [seqId, setSeqId] = useState<number>(getDefaultSeqId(searchParams.get('seq_id'), caseEntity));
  const seqExpVariants = caseEntity?.sequencing_experiments.filter(seqExp => seqExp.has_variants) ?? [];

  const { tasks: tumorOnlyTasks, isLoading: isTumorOnlyTasksLoading } = useOccurrenceTasks(
    caseId,
    seqId,
    CaseTasksWithOccurrencesDataTypeEnum.SomaticSnvTo,
  );
  const { tasks: tumorNormalTasks, isLoading: isTumorNormalTasksLoading } = useOccurrenceTasks(
    caseId,
    seqId,
    CaseTasksWithOccurrencesDataTypeEnum.SomaticSnvTn,
  );
  const isTasksLoading = isTumorOnlyTasksLoading || isTumorNormalTasksLoading;
  const selectedTaskId = useTaskIdFromSearchParam();

  // A sub-tab is offered only when the sequencing experiment has tasks producing its occurrences.
  const availableInterfaces = useMemo(() => {
    const interfaces: SomaticVariantInterface[] = [];
    if (tumorOnlyTasks.length > 0) {
      interfaces.push(SomaticVariantInterface.SNV_TO);
    }
    if (tumorNormalTasks.length > 0) {
      interfaces.push(SomaticVariantInterface.SNV_TN);
    }
    return interfaces;
  }, [tumorOnlyTasks, tumorNormalTasks]);

  const options = useMemo(
    () =>
      availableInterfaces.map(value => ({
        value,
        tooltip: t(`case_entity.variants.filters.${value.toLowerCase()}_tooltip`),
      })),
    [availableInterfaces, t],
  );

  const tasksByInterface: Partial<Record<SomaticVariantInterface, TaskOccurrenceType[]>> = {
    [SomaticVariantInterface.SNV_TO]: tumorOnlyTasks,
    [SomaticVariantInterface.SNV_TN]: tumorNormalTasks,
  };
  const tasks = (activeInterface && tasksByInterface[activeInterface]) || [];

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

  // Select the leftmost available sub-tab, on load and whenever the active one has no task on this
  // sequencing experiment — a tumor-only case has no TN task, for instance.
  useEffect(() => {
    if (isTasksLoading || availableInterfaces.length === 0) {
      return;
    }
    if (activeInterface === undefined || !availableInterfaces.includes(activeInterface)) {
      setActiveInterface(availableInterfaces[0]);
    }
  }, [availableInterfaces, activeInterface, isTasksLoading]);

  useVariantSearchParamsEffect({
    seqId,
    setSeqId,
    caseEntity,
    tasks,
    isLoading: isTasksLoading,
    variantSection: activeInterface && VARIANT_SECTIONS[activeInterface],
  });

  return (
    <div className="bg-background flex flex-col">
      <SequencingExperimentVariantFilters
        isLoading={isLoading}
        sequencingExperiments={seqExpVariants}
        options={options}
        selectedSeqId={seqId}
        handleChange={handlechange}
        activeInterface={activeInterface ?? ''}
        onActiveInterfaceChange={value => {
          setActiveInterface(value as SomaticVariantInterface);
        }}
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onTaskChange={handleTaskChange}
      />
      {(activeInterface === SomaticVariantInterface.SNV_TO || activeInterface === SomaticVariantInterface.SNV_TN) && (
        <SomaticSNVTab
          cohort={activeInterface}
          seqId={seqId}
          patientSelected={patientSelected}
          caseEntity={caseEntity}
        />
      )}
    </div>
  );
}

export default SomaticVariantsTab;
