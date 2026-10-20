import AnchorLink from '@/components/base/navigation/anchor-link';
import { Badge } from '@/components/base/shadcn/badge';
import TimeMarker from '@/components/base/timeline/time-marker';
import TimelineBadge from '@/components/base/timeline/timeline-badge';
import TimelineRow from '@/components/base/timeline/timeline-row';
import { useI18n } from '@/components/hooks/i18n';

type ChemotherapyProps = {
  protocolNameAndArm: string;
  type?: string;
  agents?: string[];
  isInitialTreatment?: boolean;
  evidenceHref?: string;
  startDay?: number;
  endDay?: number;
  years?: number;
  showLine?: boolean;
};

function Chemotherapy({
  protocolNameAndArm,
  type,
  agents,
  isInitialTreatment,
  evidenceHref,
  startDay,
  endDay,
  years,
  showLine,
}: ChemotherapyProps) {
  const { t } = useI18n();
  return (
    <TimelineRow
      badge={<TimelineBadge type="chemotherapy" />}
      marker={<TimeMarker type="treatment" startDay={startDay} endDay={endDay} years={years} />}
      showLine={showLine}
      className="min-h-14"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{protocolNameAndArm}</span>
        {isInitialTreatment && <Badge variant="secondary">{t('timeline.initial_treatment')}</Badge>}
        {evidenceHref && (
          <AnchorLink href={evidenceHref} external size="xs">
            {t('timeline.evidence')}
          </AnchorLink>
        )}
      </div>
      {type && <p className="text-muted-foreground text-xs">{type}</p>}
      {agents && agents.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {agents.map(agent => (
            <Badge key={agent} variant="outline">
              {agent}
            </Badge>
          ))}
        </div>
      )}
    </TimelineRow>
  );
}

export default Chemotherapy;
