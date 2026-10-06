import type { PatientDose, PatientEntity, PatientRadiation } from '@/api/api';

export type TreatmentType = 'surgery' | 'radiation' | 'medical_therapy';

export const DOSE_KEYS = ['craniospinal', 'focal_boost', 'total_primary'] as const;

export type TreatmentDoses = Record<(typeof DOSE_KEYS)[number], string | null>;

export type TreatmentRow = {
  day: number | null;
  type: TreatmentType;
  description: string | string[];
  doses: TreatmentDoses | null;
};

// Displayed as sent by the backend; a sentinel fills both fields, so show it once
export function formatDose(dose: PatientDose | undefined): string | null {
  const value = dose?.value?.trim();
  const unit = dose?.unit?.trim();
  if (!value) return null;
  if (!unit || unit === value) return value;
  return `${value} ${unit}`;
}

function getRadiationDoses(radiation: PatientRadiation): TreatmentDoses {
  return {
    craniospinal: formatDose(radiation.craniospinal_dose),
    focal_boost: formatDose(radiation.focal_boost_dose),
    total_primary: formatDose(radiation.total_primary_dose),
  };
}

export function toTreatmentRows({
  surgeries,
  radiations,
  therapies,
}: Pick<PatientEntity, 'surgeries' | 'radiations' | 'therapies'>): TreatmentRow[] {
  const rows: TreatmentRow[] = [
    ...surgeries.map(surgery => ({
      day: surgery.day ?? null,
      type: 'surgery' as const,
      description: surgery.extent_of_tumor_resection ?? '',
      doses: null,
    })),
    ...radiations.map(radiation => ({
      day: radiation.start.day ?? null,
      type: 'radiation' as const,
      description: radiation.site ?? '',
      doses: getRadiationDoses(radiation),
    })),
    ...therapies.map(therapy => ({
      day: therapy.start.day ?? null,
      type: 'medical_therapy' as const,
      description: therapy.chemotherapy_agents,
      doses: null,
    })),
  ];

  // Rows without a day go last
  return rows.sort((a, b) => {
    if (a.day == null || b.day == null) return (a.day == null ? 1 : 0) - (b.day == null ? 1 : 0);
    return a.day - b.day;
  });
}
