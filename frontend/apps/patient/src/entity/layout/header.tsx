import { Lock } from 'lucide-react';

import type { PatientEntity } from '@/api/api';
import { PatientEntityVitalStatusEnum } from '@/api/api';
import LibreChatDavid from '@/components/base/librechat-david/librechat-david';
import HeaderNavigation from '@/components/base/navigation/header-navigation';
import type { BadgeProps } from '@/components/base/shadcn/badge';
import { useI18n } from '@/components/hooks/i18n';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

import { PatientExplorationTabs } from '../../exploration/patient-exploration-tabs';
import { derivePatientMrn } from '../patient-mrn';

type HeaderProps = {
  patient?: PatientEntity;
  isLoading: boolean;
};

function Header({ patient, isLoading }: HeaderProps) {
  const { t } = useI18n();

  let title: React.ReactNode;
  if (patient) {
    title = patient.can_read_phi ? (
      `${patient.given_name} ${patient.family_name}`
    ) : (
      <span className="inline-flex items-center gap-2">
        <Lock className="size-4" aria-hidden />
        {t('patient_entity.header.research_id', { id: patient.patient_id })}
      </span>
    );
  }

  const mrnCell = derivePatientMrn(patient);

  let bornCell: string | undefined;
  if (patient?.can_read_phi && patient.birth_date) {
    bornCell = t('patient_entity.header.born_date', { date: patient.birth_date });
  } else if (patient?.birth_year) {
    bornCell = t('patient_entity.header.born_year', { year: patient.birth_year });
  }

  const description = patient
    ? [mrnCell, bornCell, titleCase(replaceUnderscore(patient.gender)), patient.organization_name]
        .filter(Boolean)
        .join('  ·  ')
    : undefined;

  const vitalStatusBadge: BadgeProps = {
    variant: patient?.vital_status === PatientEntityVitalStatusEnum.Alive ? 'green' : 'neutral',
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
          ? [{ variant: 'secondary' as const, children: patient.cns_integrated_diagnosis }]
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
      backLink={{ label: t('main_navbar.links.patients'), to: `/patient?tab=${PatientExplorationTabs.PatientList}` }}
      statuses={[<LibreChatDavid key="librechat-david" />]}
    />
  );
}

export default Header;
