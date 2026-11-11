import { useMemo } from 'react';

import DataTable, { DEFAULT_PAGE_SIZE } from '@/components/base/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientImaging } from '../hooks/use-patient-entity';

import { defaultImagingSettings, getImagingColumns } from './imaging-table-settings';

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
      <CardContent>
        <DataTable
          id="patient-imaging-sessions"
          columns={columns}
          data={rows}
          defaultColumnSettings={defaultImagingSettings}
          pagination={{ type: 'locale', state: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE } }}
          total={rows.length}
          loadingStates={{ total: isLoading, list: isLoading }}
          tableIndexResultPosition="bottom"
        />
      </CardContent>
    </Card>
  );
}

export default ImagingTab;
