import EmptyField from '@/components/base/information/empty-field';
import { Badge } from '@/components/base/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import type { PatientExternalRecords } from '../../api/patient';
import tefcaLogo from '../../assets/tefca.png';

import SidebarItem from './sidebar-item';

type ExternalRecordsCardProps = {
  externalRecords?: PatientExternalRecords;
  isLoading: boolean;
};

function ExternalRecordsCard({ externalRecords, isLoading }: ExternalRecordsCardProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="border-b [.border-b]:pb-2">
        <CardTitle>{t('patient_entity.sidebar.external_records.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <img src={tefcaLogo} alt="TEFCA" className="mx-auto w-full max-w-50 h-auto" />
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </>
        ) : (
          <>
            {/* TODO: define what to display when linked / connected is false once the backend data exists */}
            <SidebarItem
              label={t('patient_entity.sidebar.external_records.tefca_exchange')}
              description={externalRecords?.organization || <EmptyField />}
              action={
                externalRecords?.linked && (
                  <Badge variant="outline">{t('patient_entity.sidebar.external_records.linked')}</Badge>
                )
              }
            />
            <SidebarItem
              label={t('patient_entity.sidebar.external_records.query_status')}
              description={t('patient_entity.sidebar.external_records.query_status_description')}
              action={
                externalRecords?.connected && (
                  <Badge variant="outline" className="rounded-full text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-alert-success" />
                    {t('patient_entity.sidebar.external_records.connected')}
                  </Badge>
                )
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ExternalRecordsCard;
