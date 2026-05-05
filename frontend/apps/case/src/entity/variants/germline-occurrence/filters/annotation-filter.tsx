import { type ReactElement, type ReactNode, useMemo, useRef, useState } from 'react';
import { Check, ClipboardList, Flag, MessageSquare, MessageSquareDot, X } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/base/shadcn/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import type { FlagType } from '../hooks/use-variant-flags';
import { FLAG_CONFIG } from '../table/cells/variant-flag-cell';

import type { AnnotationFilterController } from './use-annotation-filter';

const FLAG_ORDER: FlagType[] = ['flag', 'pin', 'star'];
const ACTIVE_ICON_CLASS = 'text-primary fill-primary/20';

function ClickableTooltip({ label, children }: { label: ReactNode; children: ReactElement }) {
  const [open, setOpen] = useState(false);
  const dismissed = useRef(false);
  return (
    <Tooltip
      open={open}
      onOpenChange={next => {
        if (next && dismissed.current) return;
        setOpen(next);
      }}
    >
      <TooltipTrigger
        asChild
        onClick={() => {
          dismissed.current = true;
          setOpen(false);
        }}
        onPointerLeave={() => {
          dismissed.current = false;
        }}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type Props = {
  controller: AnnotationFilterController;
};

export default function AnnotationFilter({ controller }: Props) {
  const { t } = useI18n();
  const { filter, activeCount, setHasInterpretation, setHasNote, toggleFlag, clear } = controller;

  const value = useMemo(() => {
    const v: string[] = [];
    if (filter.hasInterpretation) v.push('interpretation');
    if (filter.hasNote) v.push('note');
    if (filter.flags.size > 0) v.push('flags');
    return v;
  }, [filter]);

  const handleValueChange = (next: string[]) => {
    setHasInterpretation(next.includes('interpretation'));
    setHasNote(next.includes('note'));
  };

  const interpretationLabel = t('case_entity.variants.filters.show_only_interpreted', 'Show only interpreted');
  const noteLabel = t('case_entity.variants.filters.show_only_commented', 'Show only commented');
  const flagLabel = t('case_entity.variants.filters.filter_by_flag', 'Filter by flag');

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <ToggleGroup
          type="multiple"
          variant="default"
          size="sm"
          value={value}
          onValueChange={handleValueChange}
          className="gap-0 rounded-md border border-input divide-x divide-input overflow-hidden bg-background"
        >
          <ClickableTooltip label={interpretationLabel}>
            <ToggleGroupItem
              value="interpretation"
              aria-label={interpretationLabel}
              className={cn('rounded-none', filter.hasInterpretation && 'bg-accent')}
            >
              <ClipboardList className={cn(filter.hasInterpretation && ACTIVE_ICON_CLASS)} />
            </ToggleGroupItem>
          </ClickableTooltip>
          <ClickableTooltip label={noteLabel}>
            <ToggleGroupItem
              value="note"
              aria-label={noteLabel}
              className={cn('rounded-none', filter.hasNote && 'bg-accent')}
            >
              {filter.hasNote ? <MessageSquareDot className={ACTIVE_ICON_CLASS} /> : <MessageSquare />}
            </ToggleGroupItem>
          </ClickableTooltip>
          <ClickableTooltip label={flagLabel}>
            <PopoverTrigger asChild>
              <ToggleGroupItem
                value="flags"
                aria-label={flagLabel}
                className={cn('rounded-none', filter.flags.size > 0 && 'bg-accent')}
              >
                {filter.flags.size === 0 ? (
                  <Flag />
                ) : (
                  FLAG_ORDER.filter(type => filter.flags.has(type)).map(type => {
                    const cfg = FLAG_CONFIG[type];
                    const Icon = cfg.icon;
                    return <Icon key={type} className={cfg.menuClass} />;
                  })
                )}
              </ToggleGroupItem>
            </PopoverTrigger>
          </ClickableTooltip>
        </ToggleGroup>
        <PopoverContent className="w-40 p-1" align="start">
          {FLAG_ORDER.map(type => {
            const cfg = FLAG_CONFIG[type];
            const Icon = cfg.icon;
            const active = filter.flags.has(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleFlag(type)}
                aria-pressed={active}
                className={cn(
                  'w-full flex items-center justify-between text-sm rounded-sm px-2 py-1.5 hover:bg-accent',
                  active && 'bg-accent',
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className={cn(cfg.menuClass, 'size-3.5')} />
                  <span>{cfg.label}</span>
                </span>
                {active && <Check className="size-3.5" />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>

      {activeCount > 0 && (
        <Button variant="link" onClick={clear} className="text-sm py-2 px-2 h-8">
          <X size={14} />
          {t('common.actions.clear', 'Clear')}
        </Button>
      )}
    </div>
  );
}
