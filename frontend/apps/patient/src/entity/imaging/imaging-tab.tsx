import { useMemo } from 'react';

import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientImaging } from '../use-patient-tab';

import { getImagingColumns } from './imaging-table-settings';

function ImagingTab() {
  const { t } = useI18n();
  const { data: imaging, isLoading } = usePatientImaging();

  const columns = useMemo(() => getImagingColumns(t), [t]);
  const rows = imaging?.sessions ?? [];

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
