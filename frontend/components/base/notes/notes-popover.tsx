import { useCallback } from 'react';
import { MessageSquare, MessageSquareDot } from 'lucide-react';

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

  /*
   * workaround to prevent popover for closing when deleting a comment
   */
  const handlePreventClosing = useCallback((e: { preventDefault: () => void }) => {
    if (document.querySelector('[role="alertdialog"]')) e.preventDefault();
  }, []);

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button className="size-6" iconOnly variant="ghost">
                {hasNotes ? (
                  <MessageSquareDot className="text-primary fill-primary/20" size={16} />
                ) : (
                  <MessageSquare className="text-muted-foreground/40" size={16} />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{hasNotes ? t('notes.variant.tooltip.view') : t('notes.variant.tooltip.add')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        align="start"
        className="w-105 p-0 gap-0 flex flex-col max-h-130"
        onFocusOutside={handlePreventClosing}
        onInteractOutside={handlePreventClosing}
      >
        <NotesContainer {...props} />
      </PopoverContent>
    </Popover>
  );
}
export default NotesPopover;
