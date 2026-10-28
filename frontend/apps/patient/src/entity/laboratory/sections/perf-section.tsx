import { TriangleAlert } from 'lucide-react';

import type { PatientPerformanceScore } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';

import LabDate from '../dates/lab-date';

const DAYS_PER_YEAR = 365.25;
const PAEDIATRIC_CUTOFF_YEARS = 16;

type ScaleAgeMismatch = 'lansky-adult' | 'karnofsky-paediatric' | null;

export function stripScoreText(scoreText: string | undefined): string {
  if (!scoreText) return '';
  return scoreText.replace(/^\s*\d+\s*[-–—]\s*/, '');
}

export function scaleAgeMismatch(scale: string | undefined, day: number | undefined): ScaleAgeMismatch {
  if (scale == null || day == null) return null;
  const years = day / DAYS_PER_YEAR;
  const key = scale.toLowerCase();
  if (key === 'lansky' && years >= PAEDIATRIC_CUTOFF_YEARS) return 'lansky-adult';
  if (key === 'karnofsky' && years < PAEDIATRIC_CUTOFF_YEARS) return 'karnofsky-paediatric';
  return null;
}

type PerfSectionProps = {
  score: PatientPerformanceScore;
  canReadPhi: boolean;
};

function PerfSection({ score, canReadPhi }: PerfSectionProps) {
  const { t } = useI18n();
  const scaleKey = score.scale.toLowerCase();
  const scaleLabel = t(`patient_entity.laboratory.performance_status.scales.${scaleKey}`, score.scale);
  const description = stripScoreText(score.score_text);
  const mismatch = scaleAgeMismatch(score.scale, score.day);

  const baseAria = t('patient_entity.laboratory.performance_status.aria_box', {
    scale: scaleLabel,
    score: score.score,
  });
  const ariaLabel = mismatch
    ? `${baseAria}. ${t(`patient_entity.laboratory.performance_status.mismatch.${mismatch}`)}`
    : baseAria;

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-col gap-1 rounded-md border bg-card p-3">
      <div className="text-sm font-medium text-muted-foreground">{scaleLabel}</div>
      <div className="flex items-baseline gap-1 text-2xl font-semibold leading-none">
        <span>{score.score}</span>
        <span className="text-sm font-normal text-muted-foreground">
          {t('patient_entity.laboratory.performance_status.score_suffix')}
        </span>
      </div>
      {description ? <div className="text-sm">{description}</div> : null}
      {mismatch ? (
        <div className="inline-flex items-center gap-1 text-xs text-amber-foreground">
          <TriangleAlert className="size-3" aria-hidden />
          {t(`patient_entity.laboratory.performance_status.mismatch.${mismatch}`)}
        </div>
      ) : null}
      <div className="inline-flex gap-1 text-xs text-muted-foreground">
        <span>{t('patient_entity.laboratory.performance_status.released')}</span>
        <LabDate day={score.day} date={score.date} canReadPhi={canReadPhi} showBoth />
      </div>
    </div>
  );
}

export default PerfSection;
