import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bot, User } from 'lucide-react';

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

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Chat/MessageScroller',
  component: MessageScroller,
} satisfies Meta<typeof MessageScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

const conversation = Array.from({ length: 12 }, (_, i) => {
  const align = i % 2 === 0 ? ('start' as const) : ('end' as const);
  return {
    id: `msg-${i}`,
    align,
    text:
      align === 'start'
        ? `Assistant message #${i + 1}: here is some context about your query.`
        : `Your message #${i + 1}: can you tell me more?`,
  };
});

export const Default: Story = {
  render: () => (
    <StorySection
      title="Default"
      description="Scrollable conversation with a scroll-to-bottom control. Scroll up to reveal it."
    >
      <div className="h-[420px] w-full max-w-md overflow-hidden rounded-lg border">
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent className="gap-4">
                {conversation.map(message => (
                  <MessageScrollerItem key={message.id} messageId={message.id}>
                    <Message align={message.align}>
                      <MessageAvatar className="size-8">
                        {message.align === 'end' ? <User className="size-4" /> : <Bot className="size-4" />}
                      </MessageAvatar>
                      <MessageContent>
                        <Bubble align={message.align} variant={message.align === 'end' ? 'default' : 'muted'}>
                          <BubbleContent>{message.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton direction="end" />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    </StorySection>
  ),
};
