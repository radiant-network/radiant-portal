import { LineChart, Lock } from 'lucide-react';

import type { PatientEntity } from '@/api/api';
import { PatientEntityPatientIdTypeEnum, PatientEntityVitalStatusEnum } from '@/api/api';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import type { BadgeProps } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';
import { useLocalPath } from '@/components/hooks/use-local-path';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

type HeaderProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

const MASKED_MRN = '*****';

function Header({ patient, isLoading }: HeaderProps) {
  const { t } = useI18n();
  const localPath = useLocalPath();

  let title: string | undefined;
  if (patient) {
    title = patient.can_read_phi
      ? `${patient.given_name} ${patient.family_name}`
      : t('patient_entity.header.research_id', { id: patient.patient_id });
  }

  const mrn =
    patient?.can_read_phi && patient.patient_id_type === PatientEntityPatientIdTypeEnum.Mrn
      ? patient.patient_id
      : MASKED_MRN;

  const description = patient
    ? [
        mrn,
        t('patient_entity.header.born', { year: patient.birth_year }),
        titleCase(replaceUnderscore(patient.gender)),
        patient.organization_name,
      ]
        .filter(Boolean)
        .join('  ·  ')
    : undefined;

  const vitalStatusBadge: BadgeProps = {
    variant: patient?.vital_status === PatientEntityVitalStatusEnum.Alive ? 'green' : 'neutral',
    size: 'lg',
    children: patient ? t(`patient_entity.header.vital_status.${patient.vital_status}`) : null,
  };

  const phiRestrictedBadge: BadgeProps & { tooltipText: string } = {
    variant: 'outline',
    tooltipText: t('patient_entity.header.phi_restricted_tooltip'),
    children: (
      <>
        <Lock />
        {t('patient_entity.header.phi_restricted')}
      </>
    ),
  };

  const badges: (BadgeProps & { tooltipText?: string })[] = patient
    ? [
        ...(patient.can_read_phi ? [] : [phiRestrictedBadge]),
        ...(patient.cns_integrated_diagnosis
          ? [{ variant: 'secondary' as const, size: 'lg' as const, children: patient.cns_integrated_diagnosis }]
          : []),
        vitalStatusBadge,
      ]
    : [];

  return (
    <HeaderNavigation
      isLoading={isLoading}
      variant="info"
      title={title}
      description={description}
      badges={badges}
      previousPageUrl={localPath('/patient')}
      buttons={[
        {
          variant: 'outline',
          size: 'sm',
          children: (
            <>
              <LineChart />
              {t('patient_entity.header.actions.visualize_survival')}
            </>
          ),
        },
      ]}
    />
  );
}

export default Header;
