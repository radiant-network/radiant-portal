import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bot, User } from 'lucide-react';

import { Bubble, BubbleContent } from '@/components/base/shadcn/bubble';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from '@/components/base/shadcn/message';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Chat/Message',
  component: Message,
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Default" description="A row with an avatar and a bubble.">
      <div className="w-full max-w-md">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>Hi! How can I help you today?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
  ),
};

export const Alignment: Story = {
  render: () => (
    <StorySection title="Alignment" description="Incoming (start) and outgoing (end) messages.">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>Hi! How can I help you today?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageAvatar className="size-8">
            <User className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <Bubble>
              <BubbleContent>I would like to explore a genomic case.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
  ),
};

export const WithHeaderFooter: Story = {
  render: () => (
    <StorySection title="With header & footer" description="Sender name above, timestamp below.">
      <div className="w-full max-w-md">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Assistant</MessageHeader>
            <Bubble variant="muted">
              <BubbleContent>Here are the variants matching your filters.</BubbleContent>
            </Bubble>
            <MessageFooter>10:42 AM</MessageFooter>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
  ),
};

export const Group: Story = {
  render: () => (
    <StorySection title="Group" description="Consecutive messages from the same sender.">
      <div className="w-full max-w-md">
        <Message align="start">
          <MessageAvatar className="size-8">
            <Bot className="size-4" />
          </MessageAvatar>
          <MessageContent>
            <MessageGroup>
              <Bubble variant="muted">
                <BubbleContent>Let me look that up for you.</BubbleContent>
              </Bubble>
              <Bubble variant="muted">
                <BubbleContent>I found 3 matching cases.</BubbleContent>
              </Bubble>
            </MessageGroup>
          </MessageContent>
        </Message>
      </div>
    </StorySection>
  ),
};
