import { Bot } from 'lucide-react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/base/shadcn/sheet';

import { useAssistant } from './assistant-provider';

/**
 * The assistant side panel shell: a right-side overlay Sheet with a header,
 * a scrollable body and a footer.
 *
 * P1 scope: the shell only — body and footer are empty placeholders.
 * P2 fills the body with the message list and the footer with the composer.
 */
export function AssistantPanel() {
  const { open, setOpen } = useAssistant();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center gap-2 border-b p-4 text-left">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Bot className="size-4" />
          </span>
          <div className="flex flex-col">
            <SheetTitle className="text-sm">Assistant</SheetTitle>
            <SheetDescription className="text-xs">Radiant genomic explorer</SheetDescription>
          </div>
        </SheetHeader>

        {/* P2: message list (MessageScroller) */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4" />

        {/* P2: composer (textarea + send) */}
        <div className="border-t p-3" />
      </SheetContent>
    </Sheet>
  );
}
