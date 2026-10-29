import { useMemo } from 'react';

import type { PatientEntity } from '@/api/api';
import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { getImagingColumns } from './imaging-table-settings';

type ImagingTabProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function ImagingTab({ patient, isLoading }: ImagingTabProps) {
  const { t } = useI18n();

  const columns = useMemo(() => getImagingColumns(t), [t]);
  const rows = patient?.imaging ?? [];

  return (
    <Card>
      <CardHeader bordered>
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <CardTitle>{t('patient_entity.imaging.title_count', { count: rows.length })}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DisplayTable data={rows} columns={columns} loading={isLoading} fullHeight />
      </CardContent>
    </Card>
  );
}

export default ImagingTab;
