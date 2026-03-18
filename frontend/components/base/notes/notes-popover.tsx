import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import NotesContainer, { NotesContainerProps } from './notes-container';

type NotesPopoverProps = NotesContainerProps & {
  hasNotes: boolean;
};

/**
 * Simple call to see if has comment
 */
function NotesPopover({ hasNotes, ...props }: NotesPopoverProps) {
  const { t } = useI18n();

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button className="relative size-6" iconOnly variant="ghost">
                <MessageSquare
                  className={hasNotes ? 'text-primary fill-primary/20' : 'text-muted-foreground/40'}
                  size={16}
                />
                {hasNotes && (
                  <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none" />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {hasNotes ? t('notes.variant.tooltip.view') : t('note.variant.comments.tooltip.add')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent align="start" className="w-[420px] p-0 gap-0 flex flex-col max-h-[520px]">
        <NotesContainer {...props} />
      </PopoverContent>
    </Popover>
  );
}
export default NotesPopover;
