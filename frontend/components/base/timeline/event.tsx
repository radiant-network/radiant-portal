import { ChevronDown, ChevronRight } from 'lucide-react';

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

  const ChevronIcon = open ? ChevronDown : ChevronRight;

  const header = (
    <div className="flex items-center gap-2 text-base font-semibold">
      <span>{type}</span>
      {cnsIntegratedDiagnosis && (
        <>
          <span>•</span>
          <span>{cnsIntegratedDiagnosis}</span>
        </>
      )}
      {collapsible && <ChevronIcon className="size-4 text-muted-foreground" aria-hidden />}
      {evidenceHref && (
        <AnchorLink href={evidenceHref} external size="xs">
          {t('timeline.evidence')}
        </AnchorLink>
      )}
    </div>
  );

  const row = (
    <TimelineRow
      badge={<TimelineBadge type="event" className={collapsible ? 'cursor-pointer' : undefined} />}
      marker={<TimeMarker type="event" startDay={startDay} years={years} />}
      showLine={showLine}
      className={collapsible ? 'bg-muted-subdued cursor-pointer' : 'bg-muted-subdued'}
    >
      {header}
      {description && description.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {description.map((item, i) => (
            <TimelineLabel key={i} label={item.label} value={item.value} />
          ))}
        </div>
      )}
    </TimelineRow>
  );

  if (!collapsible) return row;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
    >
      {row}
    </button>
  );
}

export default Event;
