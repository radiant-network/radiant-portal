import { useState } from 'react';

import { ICountInput, IListInput } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder-v3/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder-v3/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useSeqIdFromSearchParam } from '@/utils/helper';

import { defaultSNVSettings, getSNVOccurrenceColumns } from './table-settings';

function QueryBuilderV3() {
  const seqId = useSeqIdFromSearchParam();
  const caseId = useCaseIdFromParam();
  const { t } = useI18n();
  const config = useConfig();
  const [rowSelection, setRowSelection] = useState({});
  const appId = config.snv_occurrence.app_id;

  return (
    <QueryBuilder
      appId={config.snv_occurrence.app_id}
      fetcher={{
        list: async (params: IListInput) =>
          occurrencesApi.listGermlineSNVOccurrences(caseId, seqId, params.listBody).then(response => response.data),
        count: async (params: ICountInput) =>
          occurrencesApi.countGermlineSNVOccurrences(caseId, seqId, params.countBody).then(response => response.data),
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        columns={getSNVOccurrenceColumns(t)}
        defaultColumnSettings={defaultSNVSettings}
        enableColumnOrdering
        enableFullscreen
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </QueryBuilder>
  );
}
export default QueryBuilderV3;
