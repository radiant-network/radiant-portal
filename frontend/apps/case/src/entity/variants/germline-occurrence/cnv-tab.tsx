import { CaseEntity } from '@/api/api';
import { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam } from '@/utils/helper';

import { isValidSeqId } from './libs/seq-id';
import { defaultCNVSettings, getCNVOccurrenceColumns } from './table/germline-cnv-occurrence-table-settings';

type CNVTabProps = {
  seqId: number;
  caseEntity?: CaseEntity;
};

function CNVTab({ seqId, caseEntity }: CNVTabProps) {
  const { t } = useI18n();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId = config.germline_cnv_occurrence.app_id;

  if (!isValidSeqId(seqId)) {
    return null;
  }

  return (
    <QueryBuilder
      appId={appId}
      fetcher={{
        list: async (params: IListInput) =>
          occurrencesApi.listGermlineCNVOccurrences(caseId, seqId, params.listBody).then(response => response.data),
        count: async (params: ICountInput) =>
          occurrencesApi.countGermlineCNVOccurrences(caseId, seqId, params.countBody).then(response => response.data),
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        columns={getCNVOccurrenceColumns({ t, caseEntity })}
        defaultColumnSettings={defaultCNVSettings}
        defaultPageSize={30}
        enableColumnOrdering
        enableFullscreen
      />
    </QueryBuilder>
  );
}
export default CNVTab;
