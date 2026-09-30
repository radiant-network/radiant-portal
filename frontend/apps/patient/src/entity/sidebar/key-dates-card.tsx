import EmptyField from '@/components/base/information/empty-field';
import { Badge } from '@/components/base/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import type { PatientKeyDate } from '../../api/patient';

import SidebarItem from './sidebar-item';

const DAYS_PER_YEAR = 365.25;

type KeyDatesCardProps = {
  initialDiagnosis?: PatientKeyDate;
  latestEncounter?: PatientKeyDate;
  isLoading: boolean;
};

function KeyDatesCard({ initialDiagnosis, latestEncounter, isLoading }: KeyDatesCardProps) {
  const { t } = useI18n();

  // TODO: confirm with the backend whether the age is provided; day is assumed to count from birth
  const formatKeyDate = (keyDate?: PatientKeyDate) =>
    keyDate?.day == null ? (
      <EmptyField />
    ) : (
      t('patient_entity.sidebar.key_dates.day_age', {
        day: keyDate.day,
        age: (keyDate.day / DAYS_PER_YEAR).toFixed(1),
      })
    );

  const renderSource = (keyDate?: PatientKeyDate) =>
    keyDate?.source && (
      <Badge variant="secondary">
        {t(`patient_entity.sidebar.key_dates.sources.${keyDate.source}`, keyDate.source)}
      </Badge>
    );

  return (
    <Card>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle>{t('patient_entity.sidebar.key_dates.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </>
        ) : (
          <>
            <SidebarItem
              label={t('patient_entity.sidebar.key_dates.initial_diagnosis')}
              description={formatKeyDate(initialDiagnosis)}
              action={renderSource(initialDiagnosis)}
            />
            <SidebarItem
              label={t('patient_entity.sidebar.key_dates.latest_encounter')}
              description={formatKeyDate(latestEncounter)}
              action={renderSource(latestEncounter)}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default KeyDatesCard;
