import AnchorLink from '@/components/base/navigation/anchor-link';
import TimeMarker from '@/components/base/timeline/time-marker';
import TimelineBadge from '@/components/base/timeline/timeline-badge';
import TimelineLabel from '@/components/base/timeline/timeline-label';
import TimelineRow from '@/components/base/timeline/timeline-row';
import { useI18n } from '@/components/hooks/i18n';

export type EventDescriptionItem = { label: string; value: React.ReactNode };

type EventProps = {
  type: string;
  cnsIntegratedDiagnosis?: string;
  description?: EventDescriptionItem[];
  evidenceHref?: string;
  startDay?: number;
  years?: number;
  showLine?: boolean;
  open?: boolean;
  onToggle?: () => void;
};

function Event({
  type,
  cnsIntegratedDiagnosis,
  description,
  evidenceHref,
  startDay,
  years,
  showLine,
  open,
  onToggle,
}: EventProps) {
  const { t } = useI18n();
  const collapsible = onToggle !== undefined;

  const header = (
    <div className="flex items-center gap-2 text-base font-semibold">
      <span>{type}</span>
      {cnsIntegratedDiagnosis && (
        <>
          <span>•</span>
          <span>{cnsIntegratedDiagnosis}</span>
        </>
      )}
      {evidenceHref && (
        <AnchorLink href={evidenceHref} external size="xs">
          {t('timeline.evidence')}
        </AnchorLink>
      )}
    </div>
  );

  return (
    <TimelineRow
      badge={<TimelineBadge type="event" />}
      marker={<TimeMarker type="event" startDay={startDay} years={years} />}
      showLine={showLine}
      className="bg-muted"
    >
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          {header}
        </button>
      ) : (
        header
      )}
      {description && description.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {description.map((item, i) => (
            <TimelineLabel key={i} label={item.label} value={item.value} />
          ))}
        </div>
      )}
    </TimelineRow>
  );
}

export default Event;
