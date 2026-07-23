import { type Block } from '../types';

import { TextBlock } from './text-block';

/**
 * Maps a typed reply block to its component. Adding a new block type
 * (table, chart in P4) means adding a case here — the rest of the UI stays
 * untouched. This switch is the heart of the generative UI.
 */
export function BlockRenderer({ block, align }: { block: Block; align: 'start' | 'end' }) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} align={align} />;
    default:
      return null;
  }
}
