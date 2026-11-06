import { useMemo } from 'react';

import DisplayTable from '@/components/base/data-table/display-table';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTumorBoard } from '../hooks/use-patient-entity';

import CreatePresentationButton from './create-presentation-button';
import { getTumorBoardColumns } from './tumor-board-table-settings';

function TumorBoardTab() {
  const { t } = useI18n();
  const { data, isLoading } = usePatientTumorBoard();

  const columns = useMemo(() => getTumorBoardColumns(t), [t]);
  const rows = data?.sessions ?? [];

  return (
    <Card>
      <CardHeader bordered>
        {isLoading ? <Skeleton className="h-5 w-48" /> : <CardTitle>{t('patient_entity.tumor_board.title')}</CardTitle>}
        {data?.has_deck && (
          <CardAction>
            <CreatePresentationButton />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DisplayTable data={rows} columns={columns} loading={isLoading} fullHeight />
      </CardContent>
    </Card>
  );
}

export default TumorBoardTab;
