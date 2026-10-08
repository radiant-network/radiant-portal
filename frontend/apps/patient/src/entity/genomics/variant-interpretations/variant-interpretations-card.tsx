import { useMemo, useState } from 'react';
import useSWR from 'swr';

import type { ListBodyWithCriteria } from '@/api/api';
import type { PaginationState } from '@/components/base/data-table/data-table';
import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import {
  fetchInterpretationsForPatient,
  type VariantInterpretationsSearchResponse,
} from '../../../api/patient-genomics';

import { defaultSettings, getVariantInterpretationsColumns } from './variant-interpretations-table-settings';

type VariantInterpretationsCardProps = {
  patientId: string;
};

type FetchInput = {
  key: string;
  patientId: string;
  listBodyWithCriteria: ListBodyWithCriteria;
};

async function fetchInterpretations(input: FetchInput) {
  return fetchInterpretationsForPatient(input.patientId, input.listBodyWithCriteria);
}

function VariantInterpretationsCard({ patientId }: VariantInterpretationsCardProps) {
  const { t } = useI18n();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading } = useSWR<VariantInterpretationsSearchResponse, any, FetchInput>(
    {
      key: 'patient-genomics-interpretations',
      patientId,
      listBodyWithCriteria: {
        limit: pagination.pageSize,
        page_index: pagination.pageIndex,
      },
    },
    fetchInterpretations,
    { revalidateOnFocus: false },
  );

  const columns = useMemo(() => getVariantInterpretationsColumns(t), [t]);

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{t('patient_entity.genomics.interpretations.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          id="patient-variant-interpretations"
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

export default VariantInterpretationsCard;
