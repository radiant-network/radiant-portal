import { type ComponentProps, useCallback, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Toggle } from '@/components/base/shadcn/toggle';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import Chemotherapy from './chemotherapy';
import Event from './event';
import Radiation from './radiation';
import Surgery from './surgery';
import TimelineBadge, { type TimelineBadgeType } from './timeline-badge';

type TypeKind = 'event' | 'surgery' | 'radiation' | 'chemotherapy';

type TimelineProps = {
  title?: string;
  description?: string;
  events?: ComponentProps<typeof Event>[];
  surgeries?: ComponentProps<typeof Surgery>[];
  radiations?: ComponentProps<typeof Radiation>[];
  chemotherapies?: ComponentProps<typeof Chemotherapy>[];
};

type TimelineItem =
  | { kind: 'event'; day: number | undefined; props: ComponentProps<typeof Event> }
  | { kind: 'surgery'; day: number | undefined; props: ComponentProps<typeof Surgery> }
  | { kind: 'radiation'; day: number | undefined; props: ComponentProps<typeof Radiation> }
  | { kind: 'chemotherapy'; day: number | undefined; props: ComponentProps<typeof Chemotherapy> };

type TypeButton = {
  kind: TypeKind;
  i18nKey: string;
  badgeType: TimelineBadgeType;
  activeClassName: string;
};

const TYPE_BUTTONS: TypeButton[] = [
  { kind: 'event', i18nKey: 'timeline.filters.events', badgeType: 'event', activeClassName: 'bg-muted' },
  { kind: 'surgery', i18nKey: 'timeline.filters.surgery', badgeType: 'surgery', activeClassName: 'bg-avatar-cyan' },
  {
    kind: 'chemotherapy',
    i18nKey: 'timeline.filters.chemotherapy',
    badgeType: 'chemotherapy',
    activeClassName: 'bg-avatar-lime',
  },
  {
    kind: 'radiation',
    i18nKey: 'timeline.filters.radiation',
    badgeType: 'radiation',
    activeClassName: 'bg-avatar-orange',
  },
];

const PILL_CLASS = 'h-7 gap-2 rounded-md px-2 text-sm font-normal';

function Timeline({
  title,
  description,
  events = [],
  surgeries = [],
  radiations = [],
  chemotherapies = [],
}: TimelineProps) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Set<TypeKind>>(new Set());
  const isAllActive = selected.size === 0;

  const sorted = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [
      ...events.map((props): TimelineItem => ({ kind: 'event', day: props.startDay, props })),
      ...surgeries.map((props): TimelineItem => ({ kind: 'surgery', day: props.startDay, props })),
      ...radiations.map((props): TimelineItem => ({ kind: 'radiation', day: props.startDay, props })),
      ...chemotherapies.map((props): TimelineItem => ({ kind: 'chemotherapy', day: props.startDay, props })),
    ];
    return items.sort((a, b) => (a.day ?? Infinity) - (b.day ?? Infinity));
  }, [events, surgeries, radiations, chemotherapies]);

  const counts = useMemo(() => {
    const perKind: Record<TypeKind, number> = { event: 0, surgery: 0, radiation: 0, chemotherapy: 0 };
    for (const item of sorted) perKind[item.kind] += 1;
    return { all: sorted.length, ...perKind };
  }, [sorted]);

  const visible = useMemo(
    () => (isAllActive ? sorted : sorted.filter(item => selected.has(item.kind))),
    [sorted, selected, isAllActive],
  );

  const handleAllClick = useCallback(() => {
    setSelected(prev => (prev.size === 0 ? prev : new Set()));
  }, []);

  const handleTypeToggle = useCallback((kind: TypeKind) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      if (next.size === 4) return new Set();
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      )}
      <div
        role="group"
        aria-label={t('a11y.timeline.filters_group')}
        className="bg-background sticky top-0 z-10 flex flex-wrap items-center gap-2 py-2"
      >
        <Toggle
          pressed={isAllActive}
          onPressedChange={handleAllClick}
          className={cn(PILL_CLASS, isAllActive && 'bg-muted')}
        >
          <span>{t('timeline.filters.all')}</span>
          <span className="text-muted-foreground">{counts.all}</span>
        </Toggle>
        {TYPE_BUTTONS.map(button => {
          const isActive = selected.has(button.kind);
          return (
            <Toggle
              key={button.kind}
              pressed={isActive}
              onPressedChange={() => handleTypeToggle(button.kind)}
              className={cn(PILL_CLASS, isActive && button.activeClassName)}
            >
              <TimelineBadge type={button.badgeType} size="sm" />
              <span>{t(button.i18nKey)}</span>
              <span className="text-muted-foreground">{counts[button.kind]}</span>
            </Toggle>
          );
        })}
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {t('a11y.timeline.results_count', { count: visible.length })}
      </div>
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-10">
          <div className="flex size-10 items-center justify-center rounded-md border bg-background">
            <Search className="size-5" aria-hidden />
          </div>
          <p className="text-base font-semibold">{t('timeline.empty.title')}</p>
          <p className="text-muted-foreground text-sm">{t('timeline.empty.description')}</p>
        </div>
      ) : (
        <ol className="list-none pl-0">
          {visible.map((item, i) => {
            const showLine = i < visible.length - 1;
            const key = `${item.kind}-${item.day}-${i}`;
            let row: React.ReactNode;
            switch (item.kind) {
              case 'event':
                row = <Event {...item.props} showLine={showLine} />;
                break;
              case 'surgery':
                row = <Surgery {...item.props} showLine={showLine} />;
                break;
              case 'radiation':
                row = <Radiation {...item.props} showLine={showLine} />;
                break;
              case 'chemotherapy':
                row = <Chemotherapy {...item.props} showLine={showLine} />;
                break;
            }
            return <li key={key}>{row}</li>;
          })}
        </ol>
      )}
    </div>
  );
}

export default Timeline;
