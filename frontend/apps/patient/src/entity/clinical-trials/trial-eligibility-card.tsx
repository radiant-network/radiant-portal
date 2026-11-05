import { format, isValid, parseISO } from 'date-fns';
import { ArrowUpRight, CalendarCheck, Lock } from 'lucide-react';

import type { PatientTrialEligibility } from '@/api/api';
import ConfidenceGauge, { parseConfidenceToPercent } from '@/components/base/gauge/confidence-gauge';
import { Badge, type BadgeProps } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import useIsMobile from '@/components/hooks/use-is-mobile';
import { cn } from '@/components/lib/utils';

type TrialEligibilityCardProps = {
  assessment: PatientTrialEligibility;
  canReadPhi: boolean;
};

function TrialEligibilityCard({ assessment, canReadPhi }: TrialEligibilityCardProps) {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const protocolName = assessment.variable_name.replace(/\s*Eligibility\s*$/i, '').trim();

  const verdictKey = assessment.verdict?.toLowerCase().trim() ?? '';
  let badgeVariant: BadgeProps['variant'] = 'neutral';
  let verdictLabel: string = assessment.verdict;
  if (verdictKey === 'eligible') {
    badgeVariant = 'green';
    verdictLabel = t('patient_entity.clinical_trials.trial_eligibilities.verdict.eligible');
  } else if (verdictKey.includes('ineligible') && verdictKey.includes('permanent')) {
    badgeVariant = 'red';
    verdictLabel = t('patient_entity.clinical_trials.trial_eligibilities.verdict.ineligible_permanent');
  } else if (verdictKey.includes('ineligible')) {
    badgeVariant = 'orange';
    verdictLabel = t('patient_entity.clinical_trials.trial_eligibilities.verdict.ineligible_modifiable');
  }

  const percent = parseConfidenceToPercent(assessment.confidence);
  const isReviewed = assessment.review_status != null;
  const reviewLabel = isReviewed
    ? assessment.review_status
    : t('patient_entity.clinical_trials.trial_eligibilities.not_reviewed');

  const parsedLoadedAt = parseISO(assessment.loaded_at);
  const loadedAtDate = isValid(parsedLoadedAt) ? format(parsedLoadedAt, 'yyyy-MM-dd') : assessment.loaded_at;

  return (
    <div className="flex flex-col gap-3 border-b py-4 last:border-b-0 lg:px-4">
      <div className="text-lg font-semibold text-card-foreground lg:text-xl">{protocolName}</div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 items-center gap-x-4 gap-y-3 lg:grid-cols-4">
          <div className="order-1">
            <Badge variant={badgeVariant}>{verdictLabel}</Badge>
          </div>
          <div className="order-3 flex items-center gap-2 lg:order-2">
            <ConfidenceGauge percent={percent} size={isMobile ? 32 : 24} />
            <div className="flex items-baseline gap-1">
              {percent != null && <span className="text-sm font-bold text-card-foreground">{percent}%</span>}
              <span className="text-xs text-muted-foreground">
                {t('patient_entity.clinical_trials.trial_eligibilities.confidence')}
              </span>
            </div>
          </div>
          <div className="order-2 flex items-center gap-2 text-sm lg:order-3">
            <span
              className={cn('inline-block size-2.5 rounded-full', isReviewed ? 'bg-green' : 'bg-amber')}
              aria-hidden
            />
            {reviewLabel}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="order-4 flex w-fit items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- made focusable so keyboard users can open the date tooltip
                  tabIndex={0}
                >
                  <CalendarCheck className="size-4 shrink-0" aria-hidden />
                  <span className="underline decoration-dotted underline-offset-4">{loadedAtDate}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>{t('patient_entity.clinical_trials.trial_eligibilities.date_tooltip')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {canReadPhi ? (
          <div className="flex flex-col items-start gap-3">
            {assessment.reasoning && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-card-foreground">
                  {t('patient_entity.clinical_trials.trial_eligibilities.reasoning_label')}
                </span>{' '}
                {assessment.reasoning}
              </p>
            )}
            {assessment.brim_url && (
              <Button variant="outline" size="2xs" asChild>
                <a href={assessment.brim_url} target="_blank" rel="noopener noreferrer">
                  {t('patient_entity.clinical_trials.trial_eligibilities.view_in_brim')}
                  <ArrowUpRight />
                </a>
              </Button>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-4" aria-hidden />
            {t('patient_entity.clinical_trials.trial_eligibilities.phi_restricted')}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrialEligibilityCard;
