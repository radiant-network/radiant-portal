export type MessageRole = 'user' | 'assistant';

/** A text block — plain prose from the user or the assistant. */
export type TextBlock = { type: 'text'; content: string };

/**
 * A typed reply fragment. The assistant returns a list of these, and
 * `<BlockRenderer>` maps each one to a component — this is the "generative UI".
 *
 * P3 ships `text` only. P4 adds `table` and `chart`.
 */
export type Block = TextBlock;

export type Message = {
  id: string;
  role: MessageRole;
  blocks: Block[];
};
