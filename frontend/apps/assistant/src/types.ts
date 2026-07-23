export type MessageRole = 'user' | 'assistant';

/**
 * A single chat message.
 *
 * P2 keeps the payload as plain `content` text. In P3 this becomes a list of
 * typed blocks (text / table / chart) — the "generative UI" step.
 */
export type Message = {
  id: string;
  role: MessageRole;
  content: string;
};
