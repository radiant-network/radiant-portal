import { SettingsIcon } from 'lucide-react';
import { Button } from '../shadcn/button';
import { Checkbox } from '../shadcn/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/tooltip';
import { GridCards } from './grid';
import { useI18n } from '@/components/hooks/i18n';

type GridOptionsMenuSettingsProps = {
  activeCards: string[];
  cards: GridCards;
  tooltipText: string;
  isPristine: boolean;
  onCheckedChange: (id: string, checked: boolean) => void;
  onReset: () => void;
};

export function GridOptionsMenuSettings({
  cards,
  activeCards,
  isPristine,
  tooltipText,
  onCheckedChange,
  onReset,
}: GridOptionsMenuSettingsProps) {
  const { t } = useI18n();
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="2xs" iconOnly aria-label={tooltipText}>
                <SettingsIcon />
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent align="start" sideOffset={4} className="w-auto p-3">
        <div className="flex flex-col gap-2">
          <div className="flex max-h-78.75 flex-col gap-2 overflow-auto">
            {cards.map(card => (
              <label key={card.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={activeCards.includes(card.id)}
                  onCheckedChange={checked => onCheckedChange(card.id, checked as boolean)}
                />
                {card.title}
              </label>
            ))}
          </div>
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              size="xs"
              className="h-auto p-0"
              disabled={isPristine}
              onClick={onReset}
            >
              {t('common.grid.reset')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default GridOptionsMenuSettings;
