import { Check, ClipboardList, Flag, MessageSquare, Pin, Star, X } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from 'components/base/shadcn/popover';
import { ToggleGroup, ToggleGroupItem } from 'components/base/shadcn/toggle-group';
import ClickableTooltip from 'components/base/tooltips/clickable-tooltip';

import { type AnnotationFilterName, FLAG_ITEM, INTERPRETATION_ITEM, NOTE_ITEM } from './annotation-filter-items';

const FLAGS = [
  {
    icon: Flag,
    className: 'text-indicator-red fill-indicator-red',
    value: 'flag',
  },
  {
    icon: Pin,
    className: 'text-indicator-amber fill-indicator-amber',
    value: 'pin',
  },
  {
    icon: Star,
    className: 'text-indicator-blue fill-indicator-blue',
    value: 'star',
  },
];
export const FLAG_VALUES: string[] = FLAGS.map(flag => flag.value);

type AnnotationsQuickfiltersProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: AnnotationFilterName[];
};

/**
 * The quick filters on the interpretation, the comments and the flags of the occurrences, controlled:
 * value holds the active items, the note and interpretation items and the flag types.
 */
function AnnotationsQuickfilters({ value: actives, onChange, disabled = [] }: AnnotationsQuickfiltersProps) {
  const { t } = useI18n();

  const interpretationLabel = t('case_entity.variants.filters.show_only_interpreted');
  const noteLabel = t('case_entity.variants.filters.show_only_commented');
  const flagLabel = t('case_entity.variants.filters.filter_by_flag');

  const handleValueChange = (groupValue: string[]) => {
    const next = groupValue.filter(value => value != FLAG_ITEM);
    if (!(actives.length === next.length && actives.every((v, i) => v === next[i]))) onChange(next);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <ToggleGroup
          type="multiple"
          variant="default"
          size="sm"
          className="gap-0 rounded-md border border-input divide-x divide-input overflow-hidden bg-background"
          value={actives}
          onValueChange={handleValueChange}
        >
          {!disabled.includes('interpretation') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={INTERPRETATION_ITEM}
                  aria-label={interpretationLabel}
                  className={cn({ 'bg-accent': actives.includes(INTERPRETATION_ITEM) })}
                >
                  <ClipboardList
                    className={cn({ 'text-primary fill-primary/20': actives.includes(INTERPRETATION_ITEM) })}
                  />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>{interpretationLabel}</TooltipContent>
            </Tooltip>
          )}

          {!disabled.includes('note') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={NOTE_ITEM}
                  aria-label={noteLabel}
                  className={cn({ 'bg-accent': actives.includes(NOTE_ITEM) })}
                >
                  <MessageSquare className={cn({ 'text-primary fill-primary/20': actives.includes(NOTE_ITEM) })} />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>{noteLabel}</TooltipContent>
            </Tooltip>
          )}

          {!disabled.includes('flag') && (
            <ClickableTooltip label={flagLabel}>
              <PopoverTrigger asChild>
                <ToggleGroupItem
                  value={FLAG_ITEM}
                  aria-label={flagLabel}
                  className={cn({ 'bg-accent': actives.some(active => FLAG_VALUES.includes(active)) })}
                >
                  {actives.some(value => FLAG_VALUES.includes(value)) ? (
                    <>
                      {FLAGS.filter(flag => actives.includes(flag.value)).map(flag => {
                        const Icon = flag.icon;
                        return <Icon key={flag.value} className={flag.className} />;
                      })}
                    </>
                  ) : (
                    <Flag
                      className={cn({
                        'text-primary fill-primary/20': actives.some(active => FLAG_VALUES.includes(active)),
                      })}
                    />
                  )}
                </ToggleGroupItem>
              </PopoverTrigger>
            </ClickableTooltip>
          )}
        </ToggleGroup>

        <PopoverContent className="w-40 p-1" align="start" role="menu">
          {FLAGS.map(flag => {
            const Icon = flag.icon;
            return (
              <button
                key={flag.value}
                type="button"
                role="menuitemcheckbox"
                aria-checked={actives.includes(flag.value)}
                onClick={() =>
                  onChange(
                    actives.includes(flag.value)
                      ? actives.filter(value => value != flag.value)
                      : [...actives, flag.value],
                  )
                }
                className={cn(
                  'w-full flex items-center justify-between text-sm rounded-sm px-2 py-1.5 hover:bg-accent',
                  {
                    'bg-accent': actives.includes(flag.value),
                  },
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className={cn('size-3.5', flag.className)} />
                  <span>{t(`occurrence_flag.${flag.value}`)}</span>
                </span>
                {actives.includes(flag.value) && <Check className="size-3.5" />}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
      {actives.length > 0 && (
        <Button variant="link" onClick={() => onChange([])} className="text-sm py-2 px-2 h-8">
          <X size={14} />
          {t('common.actions.clear')}
        </Button>
      )}
    </div>
  );
}
export default AnnotationsQuickfilters;
