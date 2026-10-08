import { useMemo, useState } from 'react';
import useSWR from 'swr';

import type { ListBodyWithCriteria } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { fetchGenomicCasesForPatient, type GenomicCasesSearchResponse } from '../../../api/patient-genomics';

import { defaultSettings, getGenomicCasesColumns } from './genomic-cases-table-settings';

type GenomicCasesCardProps = {
  patientId: string;
};

type FetchInput = {
  key: string;
  patientId: string;
  listBodyWithCriteria: ListBodyWithCriteria;
};

async function fetchCases(input: FetchInput) {
  return fetchGenomicCasesForPatient(input.patientId, input.listBodyWithCriteria);
}

function GenomicCasesCard({ patientId }: GenomicCasesCardProps) {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = useSWR<GenomicCasesSearchResponse, any, FetchInput>(
    {
      key: 'patient-genomics-cases',
      patientId,
      listBodyWithCriteria: {
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
      },
    },
    fetchCases,
    { revalidateOnFocus: false },
  );

  const columns = useMemo(() => getGenomicCasesColumns(t), [t]);

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{t('patient_entity.genomics.cases.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          id="patient-genomic-cases"
          columns={columns}
          data={data?.list ?? []}
          defaultColumnSettings={defaultSettings}
          loadingStates={{ total: isLoading, list: isLoading }}
          pagination={{ state: pagination, type: 'server', onPaginationChange: setPagination }}
          total={data?.count ?? 0}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default GenomicCasesCard;
