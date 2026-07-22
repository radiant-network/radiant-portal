import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '@/components/base/shadcn/bubble';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Chat/Bubble',
  component: Bubble,
} satisfies Meta<typeof Bubble>;

export default meta;
type Story = StoryObj<typeof meta>;

const variants = ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive'] as const;

export const Variants: Story = {
  render: () => (
    <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {variants.map(variant => (
          <Bubble key={variant} variant={variant}>
            <BubbleContent>{variant} bubble</BubbleContent>
          </Bubble>
        ))}
      </div>
    </StorySection>
  ),
};

export const Alignment: Story = {
  render: () => (
    <StorySection title="Alignment" description="Incoming aligns to the start, outgoing to the end.">
      <div className="flex w-full max-w-md flex-col gap-2">
        <Bubble align="start" variant="muted">
          <BubbleContent>Hi! How can I help you today?</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>I would like to explore a genomic case.</BubbleContent>
        </Bubble>
      </div>
    </StorySection>
  ),
};

export const Group: Story = {
  render: () => (
    <StorySection title="Group" description="Consecutive bubbles from the same sender.">
      <BubbleGroup className="max-w-md">
        <Bubble variant="muted">
          <BubbleContent>First message.</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>A follow-up in the same group.</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>And one more.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </StorySection>
  ),
};

export const WithReactions: Story = {
  render: () => (
    <StorySection title="With reactions">
      <div className="pb-4">
        <Bubble variant="muted">
          <BubbleContent>Reactions sit on the bubble surface.</BubbleContent>
          <BubbleReactions>👍 3</BubbleReactions>
        </Bubble>
      </div>
    </StorySection>
  ),
};
