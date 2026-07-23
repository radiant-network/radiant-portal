import { Cat, User } from 'lucide-react';

import { Bubble, BubbleContent } from '@/components/base/shadcn/bubble';
import { Message, MessageAvatar, MessageContent } from '@/components/base/shadcn/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/base/shadcn/message-scroller';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/base/shadcn/sheet';

import { BlockRenderer } from './blocks/block-renderer';
import { AssistantComposer } from './assistant-composer';
import { useAssistant } from './assistant-provider';

/**
 * The assistant side panel: a right-side overlay Sheet with a header,
 * a scrollable conversation and a composer footer.
 *
 * P2 scope: the send → reply cycle with a mock engine. Replies render as
 * plain text bubbles for now; typed blocks (table/chart) arrive in P3–P4.
 */
export function AssistantPanel() {
  const { open, setOpen, messages, isResponding } = useAssistant();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center gap-2 border-b p-4 text-left">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <Cat className="size-4" />
          </span>
          <div className="flex flex-col">
            <SheetTitle className="text-sm">Assistant</SheetTitle>
            <SheetDescription className="text-xs">Radiant genomic explorer</SheetDescription>
          </div>
        </SheetHeader>

        <div className="relative min-h-0 flex-1">
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport className="p-4">
                <MessageScrollerContent className="gap-4">
                  {messages.length === 0 && !isResponding ? (
                    <p className="mt-8 text-center text-sm text-muted-foreground">Ask a question to get started.</p>
                  ) : (
                    messages.map(message => (
                      <MessageScrollerItem key={message.id} messageId={message.id}>
                        <Message align={message.role === 'user' ? 'end' : 'start'}>
                          <MessageAvatar className="size-8">
                            {message.role === 'user' ? <User className="size-4" /> : <Cat className="size-4" />}
                          </MessageAvatar>
                          <MessageContent>
                            {message.blocks.map((block, index) => (
                              <BlockRenderer
                                key={index}
                                block={block}
                                align={message.role === 'user' ? 'end' : 'start'}
                              />
                            ))}
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))
                  )}

                  {isResponding && (
                    <MessageScrollerItem>
                      <Message align="start">
                        <MessageAvatar className="size-8">
                          <Cat className="size-4" />
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble align="start" variant="muted">
                            <BubbleContent className="text-muted-foreground">…</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton direction="end" />
            </MessageScroller>
          </MessageScrollerProvider>
        </div>

        <div className="border-t p-3">
          <AssistantComposer />
        </div>
      </SheetContent>
    </Sheet>
  );
}
