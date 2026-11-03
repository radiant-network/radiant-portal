import { useState } from 'react';
import { Unlink } from 'lucide-react';

import Empty from '@/components/base/empties/empty';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Skeleton } from '@/components/base/shadcn/skeleton';
import { useI18n } from '@/components/hooks/i18n';

import tefcaLogo from '../../assets/tefca.png';
import { usePatientExternalRecords } from '../hooks/use-patient-entity';

import ExternalRecordsModal from './external-records-modal';

function ExternalRecordsCard() {
  const { t } = useI18n();
  const { data, isLoading } = usePatientExternalRecords();
  const [modalOpen, setModalOpen] = useState(false);

  const hasOrganizations = (data?.organizations.length ?? 0) > 0;

  return (
    <Card>
      <CardHeader bordered>
        <CardTitle>{t('patient_entity.sidebar.external_records.title')}</CardTitle>
        <CardAction>
          <img src={tefcaLogo} alt="TEFCA" className="h-5 w-auto" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col">
        <CardBody isLoading={isLoading} data={data} onViewDetails={() => setModalOpen(true)} />
      </CardContent>
      {data && hasOrganizations && (
        <ExternalRecordsModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          organizations={data.organizations}
          organizationCount={data.organization_count}
          documentCount={data.document_count}
        />
      )}
    </Card>
  );
}

type CardBodyProps = {
  isLoading: boolean;
  data: ReturnType<typeof usePatientExternalRecords>['data'];
  onViewDetails: () => void;
};

function CardBody({ isLoading, data, onViewDetails }: CardBodyProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full mt-2" />
        <Skeleton className="h-9 w-full mt-2" />
      </>
    );
  }

  if (!data || data.organizations.length === 0) {
    return (
      <Empty
        size="mini"
        iconType="custom"
        icon={Unlink}
        title={t('patient_entity.sidebar.external_records.not_connected.title')}
        description={t('patient_entity.sidebar.external_records.not_connected.description')}
      />
    );
  }

  return (
    <>
      <CountRow
        label={t('patient_entity.sidebar.external_records.organizations')}
        value={data.organization_count}
        first
      />
      <CountRow label={t('patient_entity.sidebar.external_records.documents')} value={data.document_count} />
      <CountRow label={t('patient_entity.sidebar.external_records.document_types')} value={data.document_class_count} />
      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onViewDetails}>
        {t('patient_entity.sidebar.external_records.view_details')}
      </Button>
    </>
  );
}

type CountRowProps = {
  label: string;
  value?: number;
  first?: boolean;
};

function CountRow({ label, value, first }: CountRowProps) {
  return (
    <div className={`flex items-center justify-between gap-3 border-b py-2 ${first ? 'pt-0' : ''}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-base font-bold tabular-nums">{(value ?? 0).toLocaleString()}</span>
    </div>
  );
}

export default ExternalRecordsCard;
