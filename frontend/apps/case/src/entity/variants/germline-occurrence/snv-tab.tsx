import { useMemo } from 'react';

import { CaseEntity, CaseSequencingExperiment } from '@/api/api';
import { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { getPatientClinicalInformation } from '@/components/lib/case-entity';
import { DEFAULT_TENANT, occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import { isValidSeqId } from './libs/seq-id';
import SliderGermlineOccurrenceSheet from './sliders/slider-germline-occurrence-sheet';
import {
  defaultGermlineSNVSettings,
  getGermlineSNVOccurrenceColumns,
} from './table/germline-snv-occurrence-table-settings';

type SNVTabProps = {
  seqId: number;
  patientSelected?: CaseSequencingExperiment;
  caseEntity?: CaseEntity;
};

function SNVTab({ seqId, patientSelected, caseEntity }: SNVTabProps) {
  const { t } = useI18n();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId = config.germline_snv_occurrence.app_id;
  const patient = getPatientClinicalInformation(caseEntity, patientSelected);
  const taskId = useTaskIdFromSearchParam();

  const columns = useMemo(
    () => getGermlineSNVOccurrenceColumns({ t, caseEntity, patientId: patient?.patient_id }),
    [t, caseEntity, patient?.patient_id],
  );

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
            .listGermlineSNVOccurrences(DEFAULT_TENANT, caseId, seqId, taskId, params.listBody)
            .then(response => response.data);
        },
        count: async (params: ICountInput) => {
          if (taskId === undefined) return { count: 0 };
          return occurrencesApi
            .countGermlineSNVOccurrences(DEFAULT_TENANT, caseId, seqId, taskId, params.countBody)
            .then(response => response.data);
        },
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        swrId={`${seqId}-${taskId}`}
        columns={columns}
        defaultColumnSettings={defaultGermlineSNVSettings}
        defaultPageSize={30}
        enableColumnOrdering
        enableFullscreen
        extras={[
          <SliderGermlineOccurrenceSheet key="germline-snv-occurrence-sheet" patientSelected={patientSelected} />,
        ]}
      />
    </QueryBuilder>
  );
}
export default SNVTab;
