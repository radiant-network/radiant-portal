import type { PatientRadiation, PatientTreatments } from '../../api/patient';

export type TreatmentType = 'surgery' | 'radiation' | 'medical_therapy';

export type TreatmentRow = {
  day: number | null;
  type: TreatmentType;
  description: string | string[];
  dose: string | null;
};

// Below this value a cGy/CGE dose is already Gy-scale (extract mixes magnitudes)
const GY_SCALE_THRESHOLD = 100;
const CGY_PER_GY = 100;

// TODO: confirm with the backend whether doses are normalised server-side
export function formatDoseInGy(value: string | null, unit: string | null): string | null {
  if (value == null || unit == null) return null;

  const normalizedUnit = unit.trim().toLowerCase();
  const doses = value.split('/').map(part => {
    const dose = parseFloat(part.trim());
    if (!Number.isFinite(dose)) return null;
    if (normalizedUnit === 'cgy' || normalizedUnit === 'cge') {
      return dose < GY_SCALE_THRESHOLD ? dose : dose / CGY_PER_GY;
    }
    return dose;
  });

  if (doses.some(dose => dose == null)) return null;
  return `${doses.map(dose => dose!.toFixed(1)).join('/')} Gy`;
}

function formatRadiationDose(radiation: PatientRadiation) {
  return formatDoseInGy(radiation.total_radiation_dose, radiation.total_radiation_dose_unit);
}

export function toTreatmentRows({ surgeries, radiations, regimens }: PatientTreatments): TreatmentRow[] {
  const rows: TreatmentRow[] = [
    ...surgeries.map(surgery => ({
      day: surgery.surgery_date,
      type: 'surgery' as const,
      description: surgery.extent_of_tumor_resection,
      dose: null,
    })),
    ...radiations.map(radiation => ({
      day: radiation.radiation_start_date,
      type: 'radiation' as const,
      description: radiation.radiation_site,
      dose: formatRadiationDose(radiation),
    })),
    ...regimens.map(regimen => ({
      day: regimen.regimen_start_date,
      type: 'medical_therapy' as const,
      description: regimen.chemotherapy_agents,
      dose: null,
    })),
  ];

  // Rows without a day go last
  return rows.sort((a, b) => {
    if (a.day == null || b.day == null) return (a.day == null ? 1 : 0) - (b.day == null ? 1 : 0);
    return a.day - b.day;
  });
}
