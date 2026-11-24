import { useMemo } from 'react';

import type { CaseEntity, SortBody } from '@/api/api';
import { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import type { ICountInput, IListInput } from '@/components/base/query-builder/hooks/use-query-builder';
import QueryBuilder from '@/components/base/query-builder/query-builder';
import QueryBuilderDataTable from '@/components/base/query-builder/query-builder-data-table';
import { useConfig } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';
import { useTenant } from '@/components/hooks/use-tenant';
import { occurrencesApi } from '@/utils/api';
import { useCaseIdFromParam, useTaskIdFromSearchParam } from '@/utils/helper';

import AnnotationsTableQuickfilters from '../filters/annotations-table-quickfilters';
import { isValidSeqId } from '../germline-occurrence/libs/seq-id';

import {
  defaultSomaticCNVSettings,
  getSomaticCNVOccurrenceColumns,
} from './table/somatic-cnv-occurrence-table-settings';

const SOMATIC_CNV_DEFAULT_SORTING: SortBody[] = [{ field: 'seq_id', order: 'asc' }];

type SomaticCNVTabProps = {
  seqId: number;
  caseEntity?: CaseEntity;
};

function SomaticCNVTab({ seqId, caseEntity }: SomaticCNVTabProps) {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const config = useConfig();
  const caseId = useCaseIdFromParam();
  const appId = config.somatic_cnv_to_occurrence.app_id;
  const taskId = useTaskIdFromSearchParam();

  const columns = useMemo(() => getSomaticCNVOccurrenceColumns({ t, caseEntity }), [t, caseEntity]);

  if (!isValidSeqId(seqId)) {
    return null;
  }

  return (
    <QueryBuilder
      appId={appId}
      swrId={`${seqId}-${taskId}`}
      fetcher={{
        list: async (params: IListInput) => {
          if (taskId === undefined) return [];
          return occurrencesApi
            .listSomaticCNVOccurrences(tenant, caseId, seqId, taskId, params.listBody)
            .then(response => response.data);
        },
        count: async (params: ICountInput) => {
          if (taskId === undefined) return { count: 0 };
          return occurrencesApi
            .countSomaticCNVOccurrences(tenant, caseId, seqId, taskId, params.countBody)
            .then(response => response.data);
        },
      }}
    >
      <QueryBuilderDataTable
        id={appId}
        swrId={`${seqId}-${taskId}`}
        columns={columns}
        defaultColumnSettings={defaultSomaticCNVSettings}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultSorting={SOMATIC_CNV_DEFAULT_SORTING}
        enableColumnOrdering
        enableFullscreen
        TableFilters={<AnnotationsTableQuickfilters disabled={['interpretation']} />}
      />
    </QueryBuilder>
  );
}
export default SomaticCNVTab;
