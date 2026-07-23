import { type Block } from '../types';

/**
 * The seam between the chat UI and the "brain".
 *
 * Today the only implementation is {@link mockEngine} (scripted, no network).
 * When a real backend/LLM exists, an `HttpEngine` implementing this same
 * interface can be swapped in without touching the UI.
 */
export interface AssistantEngine {
  /** Produce the assistant's reply as a list of typed blocks. */
  reply(userText: string): Promise<Block[]>;
}

/** Small helper to simulate latency in the mock engine. */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
