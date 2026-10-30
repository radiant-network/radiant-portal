import { type ComponentProps, useMemo } from 'react';
import type { TFunction } from 'i18next';

import type { PatientEntity, PatientEvent, PatientRadiation, PatientSurgery, PatientTherapy } from '@/api/api';
import { Card, CardContent } from '@/components/base/shadcn/card';
import type Chemotherapy from '@/components/base/timeline/chemotherapy';
import type Event from '@/components/base/timeline/event';
import type Radiation from '@/components/base/timeline/radiation';
import type Surgery from '@/components/base/timeline/surgery';
import Timeline from '@/components/base/timeline/timeline';
import { useI18n } from '@/components/hooks/i18n';

import { usePatientTreatments } from '../hooks/use-patient-entity';
import { formatDose } from '../treatments/treatment-rows';

type TimelineTabProps = {
  patient?: PatientEntity;
};

function dayToYears(day: number | undefined): number | undefined {
  return day !== undefined ? day / 365.25 : undefined;
}

function joinNonEmpty(parts: (string | undefined)[]): string | undefined {
  const filtered = parts.filter((p): p is string => Boolean(p));
  return filtered.length ? filtered.join(', ') : undefined;
}

function mapEvent(event: PatientEvent, t: TFunction): ComponentProps<typeof Event> {
  const description: ComponentProps<typeof Event>['description'] = [];
  const tumorLocs = joinNonEmpty([...event.tumor_locations, event.tumor_location_other]);
  if (tumorLocs)
    description.push({ label: t('patient_entity.timeline.event_fields.tumor_locations'), value: tumorLocs });
  const metastasisLocs = joinNonEmpty([...event.metastasis_locations, event.metastasis_location_other]);
  if (metastasisLocs) {
    description.push({
      label: t('patient_entity.timeline.event_fields.metastasis_locations'),
      value: metastasisLocs,
    });
  } else if (event.metastasis) {
    description.push({ label: t('patient_entity.timeline.event_fields.metastasis'), value: event.metastasis });
  }

  return {
    type: t(`patient_entity.timeline.event_type.${event.event_type}`),
    cnsIntegratedDiagnosis: event.cns_integrated_diagnosis,
    description: description.length ? description : undefined,
    startDay: event.day,
    years: dayToYears(event.day),
  };
}

function mapSurgery(s: PatientSurgery): ComponentProps<typeof Surgery> {
  return {
    extentOfTumorResection: s.extent_of_tumor_resection ?? '—',
    isInitialTreatment: s.is_initial_treatment ?? undefined,
    startDay: s.day,
    years: dayToYears(s.day),
  };
}

function mapTherapy(th: PatientTherapy): ComponentProps<typeof Chemotherapy> {
  return {
    protocolNameAndArm: th.protocol_name_and_arm ?? th.protocol_name ?? '—',
    type: th.chemotherapy_type,
    agents: th.chemotherapy_agents.length ? th.chemotherapy_agents : undefined,
    isInitialTreatment: th.is_initial_treatment ?? undefined,
    startDay: th.start.day,
    endDay: th.stop.day,
    years: dayToYears(th.start.day),
  };
}

function mapRadiation(r: PatientRadiation, t: TFunction): ComponentProps<typeof Radiation> {
  const description: ComponentProps<typeof Radiation>['description'] = [];
  const doses: Array<[string, ReturnType<typeof formatDose>]> = [
    [t('patient_entity.timeline.radiation_doses.craniospinal'), formatDose(r.craniospinal_dose)],
    [t('patient_entity.timeline.radiation_doses.focal_boost'), formatDose(r.focal_boost_dose)],
    [t('patient_entity.timeline.radiation_doses.total_primary'), formatDose(r.total_primary_dose)],
  ];
  for (const [label, value] of doses) {
    if (value) description.push({ label, value });
  }

  return {
    site: r.site ?? r.site_other ?? '—',
    type: r.type ?? r.type_other,
    description: description.length ? description : undefined,
    isInitialTreatment: r.is_initial_treatment ?? undefined,
    startDay: r.start.day,
    endDay: r.stop.day,
    years: dayToYears(r.start.day),
  };
}

function TimelineTab({ patient }: TimelineTabProps) {
  const { t } = useI18n();
  const { data: treatments } = usePatientTreatments();

  const events = useMemo(() => (patient?.events ?? []).map(e => mapEvent(e, t)), [patient, t]);
  const surgeries = useMemo(() => (treatments?.surgeries ?? []).map(mapSurgery), [treatments]);
  const chemotherapies = useMemo(() => (treatments?.therapies ?? []).map(mapTherapy), [treatments]);
  const radiations = useMemo(() => (treatments?.radiations ?? []).map(r => mapRadiation(r, t)), [treatments, t]);

  return (
    <Card>
      <CardContent>
        <Timeline
          title={t('patient_entity.timeline.title')}
          description={t('patient_entity.timeline.description')}
          events={events}
          surgeries={surgeries}
          chemotherapies={chemotherapies}
          radiations={radiations}
        />
      </CardContent>
    </Card>
  );
}

export default TimelineTab;
