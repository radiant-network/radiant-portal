import { type AssistantEngine, wait } from './engine';

/**
 * P3 mock: echoes the user message back as a single text block after a short
 * delay. P4 replaces this with scripted answers that return richer blocks
 * (tables, charts) from fixtures.
 */
export const mockEngine: AssistantEngine = {
  async reply(userText) {
    await wait(600);
    return [
      {
        type: 'text',
        content: `You said: “${userText}”. This is a mocked reply — real answers (tables, charts) come in a later phase.`,
      },
    ];
  },
};
