import { type AssistantEngine, wait } from './engine';

/**
 * P2 mock: echoes the user message back after a short delay, so we can prove
 * the send → reply cycle end to end. P4 replaces this with scripted answers
 * that return typed blocks (tables, charts) from fixtures.
 */
export const mockEngine: AssistantEngine = {
  async reply(userText) {
    await wait(600);
    return `You said: “${userText}”. This is a mocked reply — real answers (tables, charts) come in a later phase.`;
  },
};
