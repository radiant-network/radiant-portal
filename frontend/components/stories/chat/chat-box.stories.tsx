import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bot, Info, Paperclip, SendHorizontal, User } from 'lucide-react';

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/base/shadcn/attachment';
import { Bubble, BubbleContent, BubbleReactions } from '@/components/base/shadcn/bubble';
import { Button } from '@/components/base/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/base/shadcn/dialog';
import { Marker, MarkerContent, MarkerIcon } from '@/components/base/shadcn/marker';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from '@/components/base/shadcn/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/base/shadcn/message-scroller';
import { Textarea } from '@/components/base/shadcn/textarea';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Chat/ChatBox',
  component: MessageScroller,
} satisfies Meta<typeof MessageScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

type ChatItem =
  | { kind: 'marker'; id: string; variant: 'default' | 'separator'; withIcon?: boolean; text: string }
  | {
      kind: 'message';
      id: string;
      align: 'start' | 'end';
      header?: string;
      text: string;
      footer?: string;
      reactions?: string;
      attachment?: { title: string; description: string };
    };

const conversation: ChatItem[] = [
  { kind: 'marker', id: 'd-yesterday', variant: 'separator', text: 'Yesterday' },
  {
    kind: 'message',
    id: 'm1',
    align: 'start',
    header: 'Assistant',
    text: 'Welcome back! Want to pick up where we left off?',
  },
  { kind: 'message', id: 'm2', align: 'end', text: 'Yes, I was reviewing case 1024.' },
  { kind: 'message', id: 'm3', align: 'start', text: 'Here is the summary from your last session.' },
  {
    kind: 'message',
    id: 'm4',
    align: 'end',
    text: 'I re-uploaded the latest VCF.',
    attachment: { title: 'case-1024.vcf', description: '128 KB' },
  },
  { kind: 'message', id: 'm5', align: 'start', text: 'Thanks, I have indexed 3 new variants.', footer: '4:58 PM' },

  { kind: 'marker', id: 'd-today', variant: 'separator', text: 'Today' },
  { kind: 'message', id: 'm6', align: 'start', header: 'Assistant', text: 'Good morning! Ready to continue?' },
  { kind: 'message', id: 'm7', align: 'end', text: 'Yes. Show me the pathogenic variants.' },
  {
    kind: 'message',
    id: 'm8',
    align: 'start',
    text: 'I found 3 variants matching your filters.',
    reactions: '👍 2',
  },
  { kind: 'message', id: 'm9', align: 'end', text: 'Can you export them?' },
  { kind: 'message', id: 'm10', align: 'start', text: 'Exported to your workspace.', footer: '10:42 AM' },
  { kind: 'message', id: 'm11', align: 'end', text: 'Perfect, thanks!' },
  { kind: 'message', id: 'm12', align: 'start', text: 'Anything else I can help with?' },

  { kind: 'marker', id: 's-note', variant: 'default', withIcon: true, text: 'The assistant updated its answer.' },
];

/** Scrollable conversation — fills its flex parent and scrolls internally. */
function Conversation() {
  return (
    <div className="relative min-h-0 flex-1">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent className="gap-4">
              {conversation.map(item =>
                item.kind === 'marker' ? (
                  <MessageScrollerItem key={item.id}>
                    <Marker variant={item.variant}>
                      {item.withIcon && (
                        <MarkerIcon>
                          <Info />
                        </MarkerIcon>
                      )}
                      <MarkerContent>{item.text}</MarkerContent>
                    </Marker>
                  </MessageScrollerItem>
                ) : (
                  <MessageScrollerItem
                    key={item.id}
                    messageId={item.id}
                    className={item.reactions ? 'pb-4' : undefined}
                  >
                    <Message align={item.align}>
                      <MessageAvatar className="size-8">
                        {item.align === 'end' ? <User className="size-4" /> : <Bot className="size-4" />}
                      </MessageAvatar>
                      <MessageContent>
                        {item.header && <MessageHeader>{item.header}</MessageHeader>}
                        <Bubble align={item.align} variant={item.align === 'end' ? 'default' : 'muted'}>
                          <BubbleContent>{item.text}</BubbleContent>
                          {item.reactions && <BubbleReactions>{item.reactions}</BubbleReactions>}
                        </Bubble>
                        {item.attachment && (
                          <Attachment size="sm">
                            <AttachmentMedia>
                              <Paperclip />
                            </AttachmentMedia>
                            <AttachmentContent>
                              <AttachmentTitle>{item.attachment.title}</AttachmentTitle>
                              <AttachmentDescription>{item.attachment.description}</AttachmentDescription>
                            </AttachmentContent>
                          </Attachment>
                        )}
                        {item.footer && <MessageFooter>{item.footer}</MessageFooter>}
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ),
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}

/** Message input row — local state only, the send button just clears the field. */
function Composer() {
  const [value, setValue] = useState('');

  return (
    <div className="flex w-full items-center gap-2">
      <Button variant="ghost" size="sm" iconOnly aria-label="Add attachment">
        <Paperclip />
      </Button>
      <Textarea
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder="Type a message…"
        className="flex-1 resize-none"
      />
      <Button size="sm" iconOnly disabled={!value.trim()} onClick={() => setValue('')} aria-label="Send message">
        <SendHorizontal />
      </Button>
    </div>
  );
}

/** Chat header — reused as the standalone box header and the modal header. */
function ChatHeader() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-muted">
        <Bot className="size-4" />
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Assistant</span>
        <span className="text-xs text-muted-foreground">Radiant genomic explorer</span>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <StorySection title="Chat box" description="Static assembly of the chat components — no API, no LLM.">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-card" style={{ height: 600 }}>
        <div className="border-b px-4 py-3">
          <ChatHeader />
        </div>
        <Conversation />
        <div className="border-t p-3">
          <Composer />
        </div>
      </div>
    </StorySection>
  ),
};

function ChatModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button onClick={() => setOpen(true)}>Open chat</Button>
      </DialogTrigger>
      <DialogContent
        variant="stickyBoth"
        size="md"
        className="flex flex-col overflow-hidden p-0"
        style={{ height: 600 }}
      >
        <DialogHeader icon={<Bot className="size-4" />}>
          <DialogTitle>Assistant</DialogTitle>
          <DialogDescription>Radiant genomic explorer</DialogDescription>
        </DialogHeader>
        <Conversation />
        <DialogFooter>
          <Composer />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const InModal: Story = {
  render: () => (
    <StorySection
      title="Chat box in a modal"
      description="Same chat mounted in a dialog: header, scrollable body, composer footer."
    >
      <ChatModalDemo />
    </StorySection>
  ),
};
