import { CaseEntity, CaseSequencingExperiment } from '@/api/api';
import { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { getPatientClinicalInformation } from '@/components/lib/case-entity';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import { isValidSeqId } from '../germline-occurrence/libs/seq-id';

import SliderSomaticOccurrenceSheet from './sliders/slider-somatic-occurrence-sheet';
import {
  defaultSomaticSNVSettings,
  getSomaticSNVTumorNormalColumns,
} from './table/somatic-snv-tumor-normal-table-settings';

type SomaticOccurrencesProps = {
  seqId: number;
  patientSelected?: CaseSequencingExperiment;
  caseEntity?: CaseEntity;
};

function SNVTumorNormalTab({ seqId, patientSelected, caseEntity }: SomaticOccurrencesProps) {
  const { t } = useI18n();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId = config.somatic_snv_to_occurrence.app_id;
  const patient = getPatientClinicalInformation(caseEntity, patientSelected);
  const taskId = useTaskIdFromSearchParam();

  if (!isValidSeqId(seqId)) {
    return null;
  }

  return (
    <QueryBuilder
      appId={appId}
      fetcher={{
        list: async (params: IListInput) => {
          if (taskId === undefined) return [];
          return occurrencesApi
            .listSomaticSNVOccurrences(caseId, seqId, taskId, params.listBody)
            .then(response => response.data);
        },
        count: async (params: ICountInput) => {
          if (taskId === undefined) return { count: 0 };
          return occurrencesApi
            .countSomaticSNVOccurrences(caseId, seqId, taskId, params.countBody)
            .then(response => response.data);
        },
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        swrId={`${seqId}-${taskId}`}
        columns={getSomaticSNVTumorNormalColumns({ t, caseEntity, patientId: patient?.patient_id })}
        defaultColumnSettings={defaultSomaticSNVSettings}
        enableColumnOrdering
        enableFullscreen
        extras={[
          <SliderSomaticOccurrenceSheet key="somatic-snv-to-occurrence-sheet" patientSelected={patientSelected} />,
        ]}
      />
    </QueryBuilder>
  );
}
export default SNVTumorNormalTab;
