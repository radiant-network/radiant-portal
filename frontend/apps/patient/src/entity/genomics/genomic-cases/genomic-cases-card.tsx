import { useMemo } from 'react';

import type { PatientCase } from '@/api/api';
import DataTable from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { useI18n } from '@/components/hooks/i18n';

import { defaultSettings, getGenomicCasesColumns } from './genomic-cases-table-settings';

type GenomicCasesCardProps = {
  cases: PatientCase[];
  isLoading: boolean;
};

function GenomicCasesCard({ cases, isLoading }: GenomicCasesCardProps) {
  const { t } = useI18n();

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
          data={cases}
          defaultColumnSettings={defaultSettings}
          loadingStates={{ total: isLoading, list: isLoading }}
          pagination={{ type: 'hidden' }}
          total={cases.length}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default GenomicCasesCard;
