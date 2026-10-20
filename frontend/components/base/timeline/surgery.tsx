import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import TimeMarker from '@/components/base/timeline/time-marker';
import TimelineBadge from '@/components/base/timeline/timeline-badge';
import TimelineRow from '@/components/base/timeline/timeline-row';
import { useI18n } from '@/components/hooks/i18n';

type SurgeryProps = {
  extentOfTumorResection: string;
  description?: string;
  isInitialTreatment?: boolean;
  evidenceHref?: string;
  startDay?: number;
  years?: number;
  showLine?: boolean;
};

function Surgery({
  extentOfTumorResection,
  description,
  isInitialTreatment,
  evidenceHref,
  startDay,
  years,
  showLine,
}: SurgeryProps) {
  const { t } = useI18n();
  return (
    <TimelineRow
      badge={<TimelineBadge type="surgery" />}
      marker={<TimeMarker type="treatment" startDay={startDay} years={years} />}
      showLine={showLine}
      className="min-h-14"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{extentOfTumorResection}</span>
        {isInitialTreatment && <Badge variant="secondary">{t('timeline.initial_treatment')}</Badge>}
        {evidenceHref && (
          <AnchorLink href={evidenceHref} external size="xs">
            {t('timeline.evidence')}
          </AnchorLink>
        )}
      </div>
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
    </TimelineRow>
  );
}

export default Surgery;
