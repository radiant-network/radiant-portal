import { Bubble, BubbleContent } from '@/components/base/shadcn/bubble';

import { type TextBlock as TextBlockData } from '../types';

/** Renders a text block as a chat bubble. */
export function TextBlock({ block, align }: { block: TextBlockData; align: 'start' | 'end' }) {
  return (
    <Bubble align={align} variant={align === 'end' ? 'default' : 'muted'}>
      <BubbleContent>{block.content}</BubbleContent>
    </Bubble>
  );
}
