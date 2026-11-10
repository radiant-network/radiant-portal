import type { PatientTumorBoardSession } from '@/api/api';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Separator } from '@/components/base/shadcn/separator';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTumorBoard } from '../hooks/use-patient-entity';

import CreatePresentationButton from './create-presentation-button';
import TumorBoardSessionSection from './tumor-board-session-section';

function TumorBoardTab() {
  const { t } = useI18n();
  const { data, isLoading } = usePatientTumorBoard();
  const sessions = data?.sessions ?? [];

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
      <CardContent className="flex flex-col gap-6">
        <TabBody isLoading={isLoading} sessions={sessions} />
      </CardContent>
    </Card>
  );
}

type TabBodyProps = {
  isLoading: boolean;
  sessions: PatientTumorBoardSession[];
};

function TabBody({ isLoading, sessions }: TabBodyProps) {
  const { t } = useI18n();

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('patient_entity.tumor_board.empty')}</p>;
  }

  return (
    <>
      {sessions.map((session, i) => (
        <div key={session.session_id} className="flex flex-col gap-6">
          {i > 0 && <Separator />}
          <TumorBoardSessionSection session={session} />
        </div>
      ))}
    </>
  );
}

export default TumorBoardTab;
