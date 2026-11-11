import type { PatientTumorBoardSession } from '@/api/api';
import { Badge } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';
import { formatDate } from '@/components/lib/date';

import TumorBoardReportButton from './tumor-board-report-button';

type TumorBoardSessionSectionProps = {
  session: PatientTumorBoardSession;
};

function TumorBoardSessionSection({ session }: TumorBoardSessionSectionProps) {
  const { t } = useI18n();
  const empty = t('common.components.empty_cell');

  const formattedDate = session.date ? formatDate(session.date, t('common.date.year_month_day'), true) : empty;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold leading-7">{session.reason ?? empty}</h3>
            {session.status && <Badge variant={statusBadgeVariant(session.status)}>{session.status}</Badge>}
          </div>
          <TumorBoardReportButton sessionId={session.session_id} hasReport={session.has_report} />
        </div>
        <p className="text-sm font-semibold">{session.diagnosis ?? empty}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{t('patient_entity.tumor_board.consensus')}</p>
        <p className="text-sm text-muted-foreground">{session.consensus ?? empty}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{t('patient_entity.tumor_board.recommendations')}</p>
        {session.recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="grid list-disc grid-cols-1 gap-x-2 pl-6 text-sm text-muted-foreground sm:grid-cols-2">
            {session.recommendations.map((item, i) => (
              <li key={`${i}-${item}`}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function statusBadgeVariant(status: string) {
  return status.toLowerCase() === 'signed' ? 'green' : 'secondary';
}

export default TumorBoardSessionSection;
