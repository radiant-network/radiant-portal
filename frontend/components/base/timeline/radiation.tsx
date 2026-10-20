import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import TimeMarker from '@/components/base/timeline/time-marker';
import TimelineBadge from '@/components/base/timeline/timeline-badge';
import TimelineLabel from '@/components/base/timeline/timeline-label';
import TimelineRow from '@/components/base/timeline/timeline-row';
import { useI18n } from '@/components/hooks/i18n';

export type RadiationDescriptionItem = { label: string; value: React.ReactNode };

type RadiationProps = {
  site: string;
  type?: string;
  description?: RadiationDescriptionItem[];
  isInitialTreatment?: boolean;
  evidenceHref?: string;
  startDay?: number;
  endDay?: number;
  years?: number;
  showLine?: boolean;
};

function Radiation({
  site,
  type,
  description,
  isInitialTreatment,
  evidenceHref,
  startDay,
  endDay,
  years,
  showLine,
}: RadiationProps) {
  const { t } = useI18n();
  return (
    <TimelineRow
      badge={<TimelineBadge type="radiation" />}
      marker={<TimeMarker type="treatment" startDay={startDay} endDay={endDay} years={years} />}
      showLine={showLine}
      className="min-h-14"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{site}</span>
        {type && (
          <>
            <span>•</span>
            <span>{type}</span>
          </>
        )}
        {isInitialTreatment && <Badge variant="secondary">{t('timeline.initial_treatment')}</Badge>}
        {evidenceHref && (
          <AnchorLink href={evidenceHref} external size="xs">
            {t('timeline.evidence')}
          </AnchorLink>
        )}
      </div>
      {description && description.length > 0 && (
        <div className="flex items-center gap-2">
          {description.map((item, i) => (
            <TimelineLabel key={i} label={item.label} value={item.value} />
          ))}
        </div>
      )}
    </TimelineRow>
  );
}

export default Radiation;
