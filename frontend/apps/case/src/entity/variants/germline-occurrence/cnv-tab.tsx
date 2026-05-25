import { CaseEntity, CaseTasksWithOccurrencesDataTypeEnum } from '@/api/api';
import { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { useFirstOccurrenceTaskId } from '@/components/hooks/use-first-occurrence-task-id';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

import { isValidSeqId } from './libs/seq-id';
import {
  defaultGermlineCNVSettings,
  getGermlineCNVOccurrenceColumns,
} from './table/germline-cnv-occurrence-table-settings';

type CNVTabProps = {
  seqId: number;
  caseEntity?: CaseEntity;
};

function CNVTab({ seqId, caseEntity }: CNVTabProps) {
  const { t } = useI18n();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId = config.germline_cnv_occurrence.app_id;
  const { taskId } = useFirstOccurrenceTaskId(caseId, seqId, CaseTasksWithOccurrencesDataTypeEnum.GermlineCnv);

  if (!isValidSeqId(seqId) || taskId === undefined) {
    return null;
  }

  return (
    <QueryBuilder
      appId={appId}
      fetcher={{
        list: async (params: IListInput) =>
          occurrencesApi
            .listGermlineCNVOccurrences(caseId, seqId, taskId, params.listBody)
            .then(response => response.data),
        count: async (params: ICountInput) =>
          occurrencesApi
            .countGermlineCNVOccurrences(caseId, seqId, taskId, params.countBody)
            .then(response => response.data),
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        columns={getGermlineCNVOccurrenceColumns({ t, caseEntity })}
        defaultColumnSettings={defaultGermlineCNVSettings}
        defaultPageSize={30}
        enableColumnOrdering
        enableFullscreen
      />
    </QueryBuilder>
  );
}
export default CNVTab;
