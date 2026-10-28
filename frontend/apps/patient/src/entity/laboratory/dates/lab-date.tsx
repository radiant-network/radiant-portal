import { Lock } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';

const DAYS_PER_YEAR = 365.25;

type PatientDayDateState =
  | { kind: 'no-date' }
  | { kind: 'restricted' }
  | { kind: 'date'; date: string }
  | { kind: 'age-day'; day: number; ageText: string; capped: boolean; locked: boolean };

// Ages 90+ aggregate under HIPAA Safe Harbor
export function patientAgeLabel(days: number): { ageText: string; capped: boolean } {
  const years = days / DAYS_PER_YEAR;
  if (years >= 90) return { ageText: '90+', capped: true };
  return { ageText: years.toFixed(1), capped: false };
}

export function resolvePatientDayDate(
  day: number | undefined,
  date: string | undefined,
  canReadPhi: boolean,
): PatientDayDateState {
  if (day == null && date == null) return canReadPhi ? { kind: 'no-date' } : { kind: 'restricted' };
  if (canReadPhi && date) return { kind: 'date', date };
  if (day == null) return { kind: 'no-date' };
  const { ageText, capped } = patientAgeLabel(day);
  return { kind: 'age-day', day, ageText, capped, locked: !canReadPhi };
}

type LabDateProps = {
  day?: number;
  date?: string;
  canReadPhi: boolean;
  showBoth?: boolean;
};

function LabDate({ day, date, canReadPhi, showBoth = false }: LabDateProps) {
  const { t } = useI18n();
  const state = resolvePatientDayDate(day, date, canReadPhi);

  switch (state.kind) {
    case 'no-date':
      return <span className="text-muted-foreground">{t('patient_entity.laboratory.date.no_date_on_file')}</span>;
    case 'restricted':
      return <span className="text-muted-foreground">{t('patient_entity.laboratory.date.restricted')}</span>;
    case 'date':
      if (showBoth && day != null) {
        return <span>{`${state.date} / ${day}`}</span>;
      }
      return <span>{state.date}</span>;
    case 'age-day': {
      const label = state.capped
        ? t('patient_entity.laboratory.date.age_day_capped', { day: state.day })
        : t('patient_entity.laboratory.date.age_day', { age: state.ageText, day: state.day });
      if (!state.locked) return <span>{label}</span>;
      return (
        <span className="inline-flex items-center gap-1">
          {label}
          <Lock className="size-3" aria-hidden />
          <span className="sr-only">{t('patient_entity.laboratory.date.calendar_restricted_sr')}</span>
        </span>
      );
    }
  }
}

export default LabDate;
