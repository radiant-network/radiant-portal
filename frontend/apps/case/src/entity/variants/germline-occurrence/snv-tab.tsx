import { CaseEntity, CaseSequencingExperiment } from '@/api/api';
import { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { getPatientClinicalInformation } from '@/components/lib/case-entity';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

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

  if (!isValidSeqId(seqId)) {
    return null;
  }

  return (
    <QueryBuilder
      appId={appId}
      fetcher={{
        list: async (params: IListInput) =>
          occurrencesApi.listGermlineSNVOccurrences(caseId, seqId, params.listBody).then(response => response.data),
        count: async (params: ICountInput) =>
          occurrencesApi.countGermlineSNVOccurrences(caseId, seqId, params.countBody).then(response => response.data),
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        columns={getGermlineSNVOccurrenceColumns({ t, caseEntity, patientId: patient?.patient_id })}
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
